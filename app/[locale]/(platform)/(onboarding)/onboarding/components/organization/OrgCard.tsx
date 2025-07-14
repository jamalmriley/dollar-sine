import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { truncateString } from "@/utils/general";
import {
  ORG_CATEGORIES,
  OrganizationMetadata,
  Status,
  UserMetadata,
} from "@/types/user";
import { Organization, User } from "@clerk/nextjs/server";
import { formatRelative } from "date-fns";
import Image from "next/image";
import { parseAsBoolean, useQueryState } from "nuqs";
import { BsBuildingExclamation, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdLink } from "react-icons/io";
import { MdError } from "react-icons/md";
import { FaBuilding } from "react-icons/fa6";
import { StyledDestructiveButton } from "@/components/StyledButtons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import {
  ClerkErrorResponse,
  deleteOrganization,
  getUser,
  sendRequestToOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { toast } from "@/hooks/use-toast";
import { useResetQueryState } from "@/hooks/use-resetQueryState";

export function OrgCard({
  toggle,
  org,
  tab,
}: {
  toggle: boolean;
  org: Organization;
  tab: "create" | "join";
}) {
  const { userMetadata, setIsLoading, setLastUpdated, setOrg, setOrgLogo } =
    useOnboardingContext();
  const [, setOrgName] = useQueryState("orgName", { defaultValue: "" });
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [, setOrgAddress] = useQueryState("orgAddress", { defaultValue: "" });
  const [, setOrgCategory] = useQueryState("orgCategory", { defaultValue: "" });
  const [, setIsCustomOrgCategory] = useQueryState(
    "isCustomOrgCategory",
    parseAsBoolean.withDefault(false)
  );
  const [, setIsTeacherPurchasingEnabled] = useQueryState(
    "isTeacherPurchasingEnabled",
    parseAsBoolean.withDefault(false)
  );
  const { reset } = useResetQueryState();
  const { user } = useUser();

  function splitAddress(address: string) {
    const separator = ",";
    const addressArr = address.split(separator);

    const address1: string = addressArr[0].trim();
    const address2: string = [...addressArr].slice(1).join(separator).trim();

    return { address1, address2 };
  }

  function handleEditOrganization() {
    // A helper function to return whether or not the category is a listed organization category.
    const helper = (str: string): boolean => {
      for (const category of ORG_CATEGORIES) {
        if (str === category) return false;
      }
      return true;
    };

    setCurrOnboardingStep({ step: currStep, isEditing: true });
    setOrgName(org.name);
    setOrgSlug(org.slug);
    setOrgAddress(String(metadata.address));
    setOrgCategory(metadata.category);
    setIsCustomOrgCategory(helper(metadata.category));
    setIsTeacherPurchasingEnabled(Boolean(metadata.isTeacherPurchasingEnabled));
  }

  async function handleDeleteOrganization() {
    if (!user || !userMetadata) return;
    const orgId = org.id;

    await setIsLoading(true);
    await deleteOrganization(orgId).then((res) => {
      if (res.success) {
        const userId = user.id;
        const { organizations } = userMetadata;
        const newMetadata: UserMetadata = {
          ...userMetadata,
          lastOnboardingStepCompleted: 1,
          organizations: organizations
            ? organizations.filter((org) => org !== orgId)
            : null,
        };

        updateUserMetadata(userId, newMetadata)
          .then(() => {
            reset();
            setCurrOnboardingStep({ step: currStep, isEditing: false });
            setLastUpdated(new Date().toString()); // Triggers re-render.
            setOrg(undefined);
            setOrgLogo(undefined);

            toast({
              variant: res.success ? "default" : "destructive",
              title: res.message?.title,
              description: res.message?.description,
            });
          })
          .catch((err: ClerkErrorResponse) => {
            const error = err.errors[0];

            toast({
              variant: "destructive",
              title: error.message,
              description: error.long_message,
            });
          });
      } else {
        toast({
          variant: "destructive",
          title: res.message?.title,
          description: res.message?.description,
        });
      }

      setIsLoading(false);
    });
  }

  async function handleCancelRequestToJoin() {
    if (!user) return;
    await setIsLoading(true);

    const userRes = await getUser(user.id);
    const userData = JSON.parse(userRes.data) as User;
    const userMetadata = userData.publicMetadata as unknown as UserMetadata;
    const orgMetadata = org.publicMetadata as unknown as OrganizationMetadata;

    const updatedUserInvitations = userMetadata.invitations
      ? userMetadata.invitations.filter(
          (invitation) => invitation.organizationId !== org.id
        )
      : null;
    const updatedOrgInvitations = orgMetadata.invitations
      ? orgMetadata.invitations?.filter(
          (invitation) => invitation.userId !== user.id
        )
      : null;
    const newUserMetadata: UserMetadata = {
      ...userMetadata,
      lastOnboardingStepCompleted: userMetadata.role === "guardian" ? 0 : 1,
      invitations: updatedUserInvitations,
    };
    const newOrgMetadata: OrganizationMetadata = {
      ...orgMetadata,
      invitations: updatedOrgInvitations,
    };

    await sendRequestToOrganization(
      user.id,
      newUserMetadata,
      org.id,
      newOrgMetadata,
      "cancel"
    )
      .then(() => {
        setOrg(undefined);
        setLastUpdated(new Date().toString()); // Triggers re-render.
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  const { setCurrOnboardingStep } = useOnboardingContext();
  const metadata = org.publicMetadata as unknown as OrganizationMetadata;

  const getInvitationStatus = (): Status => {
    if (!userMetadata || !userMetadata.invitations) return "Pending";
    for (const invitation of userMetadata.invitations) {
      if (invitation.organizationId === org.id) return invitation.status;
    }

    return "Pending";
  };

  if (!metadata || !userMetadata) return;

  const { role } = userMetadata;
  const currStep = role === "guardian" ? 1 : 2;
  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* Org Image */}
        <div className={`expandable-content ${toggle ? "size-32" : "size-24"}`}>
          <Image
            src={org.imageUrl}
            width={0}
            height={0}
            sizes="100vw"
            alt={org.name}
            loading="eager"
            className="w-full h-auto border border-default-color rounded-lg overflow-hidden"
          />
        </div>

        {/* Org Details */}
        <div className="flex grow flex-col justify-between">
          {/* Org Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">{org.name}</span>

              {tab === "create" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <BsThreeDotsVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleEditOrganization}>
                      Edit organization
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDeleteOrganization}>
                      Delete organization
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <BsThreeDotsVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleCancelRequestToJoin}>
                      Cancel join request
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <span className="text-sm">
              {truncateString(
                splitAddress(String(metadata.address)).address1,
                40
              )}
            </span>
            <span className="text-sm">
              {truncateString(
                splitAddress(String(metadata.address)).address2,
                40
              )}
            </span>
          </div>

          {/* Org Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* Org Expanded Details */}
            <div
              className={`flex flex-col expandable-content overflow-hidden ${
                toggle ? "h-10" : "h-0"
              }`}
            >
              <span className="flex items-center text-xs text-muted-foreground">
                <FaBuilding className="size-5 mr-2 py-0.5" />
                <span>{metadata.category}</span>
              </span>
              <span className="flex items-center text-xs text-muted-foreground hover:underline">
                <IoMdLink className="size-5 mr-2" />
                dollarsi.ne/{org.slug}
              </span>
            </div>

            {/* Creation Date or Invite Status */}
            {tab === "create" ? (
              <span className="text-xs text-muted-foreground">
                Organization created{" "}
                {formatRelative(
                  new Date(org.createdAt),
                  new Date()
                  // , { locale: es } // TODO: Add locale functionality
                )}
              </span>
            ) : (
              <span
                className={`w-fit h-4 flex justify-center items-center px-2 rounded-full text-2xs dark:text-primary-foreground ${getInvitationStatus() === "Rejected" ? "bg-red-400" : getInvitationStatus() === "Accepted" ? "bg-emerald-400" : "bg-selective-yellow-200"}`}
              >
                Invite {getInvitationStatus()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrgCardSkeleton({ toggle }: { toggle: boolean }) {
  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* Organization Image */}
        <Skeleton className="aspect-square h-full rounded-lg overflow-hidden" />

        {/* Organization Details */}
        <div className="flex grow flex-col justify-between">
          {/* Organization Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <Skeleton className="w-32 h-6 my-0.5" />
              <Skeleton className="size-9 rounded-full" />
            </div>

            <Skeleton className="w-36 h-4 my-0.5" />
            <Skeleton className="w-28 h-4 my-0.5" />
          </div>

          {/* Organization Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* Organization Expanded Details */}
            <div
              className={`flex flex-col expandable-content overflow-hidden ${
                toggle ? "h-10" : "h-0"
              }`}
            >
              <span className="flex items-center">
                <Skeleton className="size-4 my-0.5 mr-2 rounded-full" />
                <Skeleton className="w-36 h-3 my-0.5 mr-2" />
              </span>
              <span className="flex items-center">
                <Skeleton className="size-4 my-0.5 mr-2 rounded-full" />
                <Skeleton className="w-16 h-3 my-0.5 mr-2" />
              </span>
            </div>

            {/* Creation Date */}
            <Skeleton className="w-48 h-3 my-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrgCardError({ toggle }: { toggle: boolean }) {
  const { setLastUpdated } = useOnboardingContext();
  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* Organization Image */}
        <div className="aspect-square h-full border border-default-color rounded-lg overflow-hidden bg-primary-foreground">
          <BsBuildingExclamation className="w-3/4 h-full mx-auto" />
        </div>

        {/* Organization Details */}
        <div className="flex grow flex-col justify-between">
          {/* Organization Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">Organization not found</span>
            </div>

            <span className="text-sm">
              We couldn&apos;t load this organization&apos;s info.
            </span>
          </div>

          {/* Organization Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* Organization Expanded Details */}
            <div
              className={`flex flex-col expandable-content overflow-hidden ${
                toggle ? "h-10" : "h-0"
              }`}
            >
              <span className="flex items-center text-xs text-muted-foreground">
                <MdError className="size-5 p-0.5 mr-2" />
                <span>Code: 400 (Bad request)</span>
              </span>
            </div>

            <StyledDestructiveButton
              onClick={() => {
                setLastUpdated(new Date().toString()); // Triggers re-render.
              }}
            >
              Try again
            </StyledDestructiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
