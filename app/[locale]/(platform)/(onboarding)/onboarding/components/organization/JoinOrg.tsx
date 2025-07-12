import { useOnboardingContext } from "@/contexts/onboarding-context";
import {
  OrganizationInvitation,
  OrganizationMetadata,
  UserInvitation,
  UserMetadata,
} from "@/types/user";
import { useUser } from "@clerk/nextjs";
import {
  getOrganizationBySlug,
  sendRequestToOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { Organization } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { OrgSearch } from "./OrgSearch";
import { StyledActionButton } from "@/components/StyledButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrgAlreadyCompleted from "./OrgAlreadyCompleted";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function JoinOrg() {
  const { currOnboardingStep, org } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;
  const currStep = 2;
  return (
    <>
      {!org || (step === currStep && isEditing) ? (
        <RequestToJoin />
      ) : (
        <OrgAlreadyCompleted tab="join" />
      )}
    </>
  );
}

export function JoinOrgCard() {
  const header = {
    title: "Request to join an organization.",
    description: "Search an organization to request joining it.",
  };
  return (
    <div className="size-full flex justify-center">
      <Card className="h-fit mx-10 max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="h2">{header.title}</CardTitle>
          </div>
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinOrg />
        </CardContent>
      </Card>
    </div>
  );
}

function RequestToJoin() {
  const {
    isLoading,
    userMetadata,
    setIsLoading,
    setLastUpdated,
    setOrg,
    orgSearch,
    setOrgSearch,
  } = useOnboardingContext();
  const { user } = useUser();
  const [joinCode, setJoinCode] = useState<string>("");
  const joinCodeLength: number = 6;
  const exampleJoinCode: string = "s3P5jH";

  async function handleRequestToJoin() {
    if (!user || !userMetadata) return;
    const { role } = userMetadata;
    if (!role) return;

    await setIsLoading(true);

    const orgRes = await getOrganizationBySlug(orgSearch);
    const org = JSON.parse(orgRes.data) as Organization;
    const orgMetadata = org.publicMetadata as any as OrganizationMetadata;

    const userInvitation: UserInvitation = {
      createdAt: new Date(),
      status: "Pending",
      organizationId: org.id,
    };

    const orgInvitation: OrganizationInvitation = {
      createdAt: new Date(),
      status: "Pending",
      userId: user.id,
    };

    const newUserMetadata: UserMetadata = {
      ...userMetadata,
      lastOnboardingStepCompleted: userMetadata.role === "guardian" ? 1 : 2,
      invitations: userMetadata.invitations
        ? [...userMetadata.invitations, userInvitation]
        : [userInvitation],
    };

    const newOrgMetadata: OrganizationMetadata = {
      ...orgMetadata,
      invitations: orgMetadata.invitations
        ? [...orgMetadata.invitations, orgInvitation]
        : [orgInvitation],
    };

    if (orgMetadata.joinCode === joinCode) {
      await sendRequestToOrganization(
        user.id,
        newUserMetadata,
        org.id,
        newOrgMetadata,
        "join"
      )
        .then(() => {
          setOrg(org);
          setOrgSearch("");
          setLastUpdated(new Date().toString()); // Triggers re-render and a useEffect which will later change isLoading to false.
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      await setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Invalid join code",
        description:
          "The join code you entered is incorrect. Please try again.",
      });
    }
  }

  async function handleSkipRequestToJoin() {
    if (!user || !userMetadata) return;

    const newUserMetadata: UserMetadata = {
      ...userMetadata,
      lastOnboardingStepCompleted: userMetadata.role === "guardian" ? 1 : 2,
    };

    await setIsLoading(true);
    await updateUserMetadata(user.id, newUserMetadata)
      .then(() => {
        setLastUpdated(new Date().toString());
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  if (!userMetadata) return;
  return (
    <div className="flex flex-col gap-5">
      {/* Org Search and Join Code */}
      <div className="form-row items-end">
        {/* Search */}
        <span className="w-64 flex flex-col gap-2">
          <Label htmlFor="joinCode">Organization</Label>
          <OrgSearch />
        </span>

        {/* Join Code */}
        <div className="form-item flex grow">
          <Label htmlFor="joinCode">Join Code</Label>
          <Input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            id="joinCode"
            name="joinCode"
            placeholder={`e.g. ${exampleJoinCode}`}
            type="text"
            autoCapitalize="off"
            required
          />
        </div>
      </div>

      <StyledActionButton
        onClick={handleRequestToJoin}
        disabled={
          isLoading ||
          orgSearch === "" ||
          joinCode === "" ||
          joinCode.length !== joinCodeLength
        }
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Request to join organization
      </StyledActionButton>

      {userMetadata.role === "guardian" && (
        <Button
          variant="link"
          className="text-muted-foreground mt-4"
          onClick={handleSkipRequestToJoin}
          disabled={isLoading}
        >
          Skip this step
        </Button>
      )}
    </div>
  );
}
