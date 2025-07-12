import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { MdClose } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CreateOrg from "./CreateOrg";
import { parseAsBoolean, useQueryState } from "nuqs";
import { JoinOrg } from "./JoinOrg";

export default function CreateOrJoinOrg() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    org,
    setOrgLogo,
    userMetadata,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  const [, setOrgName] = useQueryState("orgName", { defaultValue: "" });
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [, setOrgCategory] = useQueryState("orgCategory", { defaultValue: "" });
  const [, setIsCustomOrgCategory] = useQueryState(
    "isCustomOrgCategory",
    parseAsBoolean.withDefault(false)
  );
  const [, setOrgAddress] = useQueryState("orgAddress", { defaultValue: "" });
  const [, setIsTeacherPurchasingEnabled] = useQueryState(
    "isTeacherPurchasingEnabled",
    parseAsBoolean.withDefault(false)
  );
  const [tab, setTab] = useState<string>("create");
  const currStep = 2;

  function handleCancelForm(): void {
    setOrgName("");
    setOrgSlug("");
    setOrgCategory("");
    setIsCustomOrgCategory(false);
    setOrgAddress("");
    setIsTeacherPurchasingEnabled(false);
    setOrgLogo(undefined);
    setCurrOnboardingStep({ step: 2, isEditing: false });
  }

  // Auto-set the tab based on the user's progress.
  useEffect(() => {
    if (!org || !user?.id || !userMetadata) return;
    const { invitations, lastOnboardingStepCompleted, organizations, role } =
      userMetadata;
    const stored = localStorage.getItem("createOrJoin");

    // If the user has completed this step, check userMetadata to determine the tab state.
    if (lastOnboardingStepCompleted >= currStep) {
      // First, check if there are organizations added to this user.
      if (organizations && organizations.length > 0) {
        // See if the "org" context variable is in the organizations array.
        // If it is and the current user is the owner of this organization, then set the tab to "create".
        const isOrgPresent: boolean = organizations.indexOf(org.id) !== -1;
        const isOrgOwner: boolean = org.createdBy === user.id;
        if (isOrgPresent && isOrgOwner) setTab("create");
      }
      // If there are no organizations, then check for invitations.
      else if (invitations && invitations.length > 0) {
        // See if the user has requested to join the organization that is the "org" context variable.
        // If the user has, then set the tab to "join".
        const isOrgPresent: boolean =
          invitations.filter(
            (invitation) => invitation.organizationId === org.id
          ).length > 0;
        if (isOrgPresent) setTab("join");
      }
    }
    // If the user has not completed this step, check local storage to determine the tab state.
    else {
      if (stored) setTab(stored);
      else setTab(role === "admin" ? "create" : "join");
    }
  }, [org, userMetadata, user?.id]);

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;
  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= currStep &&
    currOnboardingStep.step === currStep &&
    currOnboardingStep.isEditing;
  const createHeader = {
    title: isUpdating
      ? "Update your organization."
      : isCompleted
        ? "Organization successfully created!"
        : "Create your organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your organization's details below."
      : isCompleted
        ? "View your organization's details below."
        : "Enter your organization's details below.",
  };
  const joinHeader = {
    title: isUpdating
      ? "Update your join request."
      : isCompleted
        ? "Join request successfully sent!"
        : "Request to join an organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your request to join an organization below."
      : isCompleted
        ? "View your organization's details below."
        : "Search an organization to request joining it.",
  };

  return (
    <div className="size-full flex justify-center">
      <Card
        className={`h-fit mx-10 expandable-content ${tab === "join" ? "max-w-lg" : "max-w-3xl"}`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="h2">
              {tab === "join" ? joinHeader.title : createHeader.title}
            </CardTitle>
            {isUpdating && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-5 lg:size-6"
                onClick={() => handleCancelForm()}
              >
                <span className="sr-only">Cancel updating my join request</span>
                <MdClose />
              </Button>
            )}
          </div>

          <CardDescription className="subtitle">
            {tab === "join" ? joinHeader.description : createHeader.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(val) => {
              setTab(val);
              localStorage.setItem("createOrJoin", val);
            }}
            className="w-full"
          >
            <TabsList className="grid w-72 grid-cols-2 select-none mx-auto mb-5">
              <TabsTrigger
                value="create"
                className={`${tab === "create" && "border-r border-default-color"}`}
                disabled={Boolean(org)}
              >
                Create
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className={`${tab === "join" && "border-l border-default-color"}`}
                onClick={() => handleCancelForm()}
                disabled={Boolean(org)}
              >
                Join
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateOrg />
            </TabsContent>
            <TabsContent
              value="join"
              className="size-full flex flex-col justify-center"
            >
              <JoinOrg />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
