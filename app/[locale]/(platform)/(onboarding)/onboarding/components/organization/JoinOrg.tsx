import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import {
  OrganizationInvitation,
  OrganizationMetadata,
  UserInvitation,
  UserMetadata,
} from "@/types/user";
import { useUser } from "@clerk/nextjs";
import {
  getOrganizationById,
  getOrganizationBySlug,
  getUser,
  sendRequestToOrganization,
} from "@/app/actions/onboarding";
import { Organization, User } from "@clerk/nextjs/server";
import { formatRelative } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaTrashCan } from "react-icons/fa6";
import { Loader2Icon } from "lucide-react";
import { IoIosSend } from "react-icons/io";
import { OrgSearch } from "./OrgSearch";

export default function JoinOrg() {
  const { hasInvitations, setHasInvitations } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  // Fetch step completion status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
        setHasInvitations(
          publicMetadata.invitations !== null &&
            publicMetadata.invitations.length > 0
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  if (!user || !isLoaded) return;
  return (
    <div className="pt-5">
      {hasInvitations ? <ViewOrEditRequestToJoin /> : <RequestToJoin />}
    </div>
  );
}

function RequestToJoin() {
  const { isLoading, setHasInvitations, setIsLoading, setLastUpdated } =
    useOnboardingContext();
  const { user } = useUser();
  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });

  async function handleRequestToJoin(orgSlug: string) {
    if (!user) return;
    await setIsLoading(true);

    const userRes = await getUser(user?.id);
    const userData = JSON.parse(userRes.data) as User;
    const userMetadata = userData.publicMetadata as any as UserMetadata;

    const orgRes = await getOrganizationBySlug(orgSlug);
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
      lastOnboardingStepCompleted: 2,
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

    await sendRequestToOrganization(
      user.id,
      newUserMetadata,
      org.id,
      newOrgMetadata,
      "join"
    )
      .then(() => {
        setOrgSlug("");
        // setIsLoading(false); // setLastUpdated will trigger a useEffect which will later change isLoading to false.
        setHasInvitations(true);
        setLastUpdated(new Date().toString());
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between gap-5">
        <span className="w-64">
          <OrgSearch />
        </span>
        <Button
          onClick={() => handleRequestToJoin(orgSlug)}
          disabled={orgSlug === "" || isLoading}
        >
          {isLoading ? <Loader2Icon className="animate-spin" /> : <IoIosSend />}
          Request to join
        </Button>
      </div>

      {/* TODO: Possibly add a "Skip this step" button with a "link" variant */}
    </div>
  );
}

function ViewOrEditRequestToJoin() {
  type InvitationListItem = {
    organization: Organization;
    invitation: UserInvitation;
  };

  const {
    setHasInvitations,
    isLoading,
    setIsLoading,
    lastUpdated,
    setLastUpdated,
    setOrgSearch,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [invitationItems, setInvitationItems] =
    useState<InvitationListItem[]>();

  function findOrg(orgId: string) {
    if (!invitationItems) return undefined;
    for (const item of invitationItems) {
      if (item.organization.id === orgId) return item.organization;
    }
    return undefined;
  }

  async function handleCancelRequestToJoin(targetOrgId: string) {
    if (!user) return;

    const userRes = await getUser(user?.id);
    const userData = JSON.parse(userRes.data) as User;
    const userMetadata = userData.publicMetadata as any as UserMetadata;
    const orgMetadata = findOrg(targetOrgId)
      ?.publicMetadata as any as OrganizationMetadata;

    const updatedUserInvitations = userMetadata.invitations
      ? userMetadata.invitations?.filter(
          (invitation) => invitation.organizationId !== targetOrgId
        )
      : null;

    const updatedOrgInvitations = orgMetadata.invitations
      ? orgMetadata.invitations?.filter(
          (invitation) => invitation.userId !== user.id
        )
      : null;

    const newUserMetadata: UserMetadata = {
      ...userMetadata,
      lastOnboardingStepCompleted: 1,
      invitations: updatedUserInvitations,
    };

    const newOrgMetadata: OrganizationMetadata = {
      ...orgMetadata,
      invitations: updatedOrgInvitations,
    };

    setIsLoading(true);

    await sendRequestToOrganization(
      user.id,
      newUserMetadata,
      targetOrgId,
      newOrgMetadata,
      "cancel"
    )
      .then(() => {
        setLastUpdated(new Date().toString());
        setOrgSearch("");
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  // Fetch organization info for invitations
  useEffect(() => {
    const fetchAndSetOrgs = async () => {
      const result: InvitationListItem[] = [];
      setIsLoading(true);

      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
        const invitations = publicMetadata.invitations;

        if (invitations) {
          for (const invitation of invitations) {
            const res = await getOrganizationById(invitation.organizationId);
            const organization = JSON.parse(res.data) as Organization;
            result.push({ organization, invitation });
          }
        }

        setInvitationItems(result);
        setHasInvitations(invitations !== null && invitations.length > 0);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetOrgs();
  }, [lastUpdated]);

  if (!user || !isLoaded) return;
  return (
    <div className="flex flex-col">
      {/* TODO: Add a loading UI for table  */}
      {isLoading ? (
        <>Loading invitations...</>
      ) : invitationItems ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Organization</TableHead>
              <TableHead className="text-center">Request sent</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitationItems?.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="text-center font-medium">
                  {findOrg(item.invitation.organizationId)?.name}
                </TableCell>
                <TableCell>
                  {formatRelative(
                    new Date(item.invitation.createdAt),
                    new Date()
                    // , { locale: es } // TODO: Add locale functionality
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={
                      item.invitation.status === "Pending" ? "pending" : ""
                    }
                  >
                    {item.invitation.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                      handleCancelRequestToJoin(item.invitation.organizationId);
                    }}
                    disabled={isLoading}
                  >
                    <FaTrashCan />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <>Error loading invitations</>
      )}
    </div>
  );
}
