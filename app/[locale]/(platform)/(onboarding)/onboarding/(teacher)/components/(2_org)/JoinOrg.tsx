import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { MdClose, MdRefresh } from "react-icons/md";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  OrganizationInvitation,
  OrganizationMetadata,
  Status,
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
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
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

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch(
  algoliaAppId as string,
  algoliaApiKey as string
);

export default function JoinOrg() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    orgSearch,
    setIsLoading,
    lastUpdated,
    setLastUpdated,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [org, setOrg] = useState<Organization>();

  const { step, isEditing } = currOnboardingStep;
  const currStep = 2;
  const metadata = user?.publicMetadata as any as UserMetadata;
  const initIsCompleted = metadata.lastOnboardingStepCompleted >= currStep;
  const [isCompleted, setIsCompleted] = useState<boolean>(initIsCompleted);
  const [createdAt, status]: [Date, Status] = [new Date(), "Pending"];

  const handleRequestToJoin = async () => {
    if (!user || !org) return;

    const userMetadata = user.publicMetadata as any as UserMetadata;
    const orgMetadata = org.publicMetadata as any as OrganizationMetadata;

    const userInvitation: UserInvitation = {
      createdAt,
      status,
      organizationId: org.id,
    };

    const orgInvitation: OrganizationInvitation = {
      createdAt,
      status,
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

    setIsLoading(true);

    await sendRequestToOrganization(
      user.id,
      newUserMetadata,
      org.id,
      newOrgMetadata,
      "join"
    )
      .then((res) => {
        setOrgSlug("");
        setIsLoading(false);
        setCurrOnboardingStep({ step: 2, isEditing: false });
        setLastUpdated(new Date().toString()); // Triggers Profile.tsx and JoinOrg.tsx to re-render.

        toast({
          variant: res.success ? "default" : "destructive",
          title: res.message?.title,
          description: res.message?.description,
          action: (
            <ToastAction
              altText={res.success ? "Dismiss" : "Try again"}
              className="flex gap-2"
              onClick={() => {
                if (!res.success) handleRequestToJoin();
              }}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);

        toast({
          variant: "destructive",
          title: "Error updating profile",
          description:
            "There was an issue updating your profile. Try again or contact support if the issue persists.",
          action: (
            <ToastAction
              altText="Try again"
              className="flex gap-2"
              onClick={() => handleRequestToJoin()}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      });
  };

  // Fetch organization info
  useEffect(() => {
    const fetchAndSetOrg = async () => {
      setIsLoading(true);
      try {
        const res = await getOrganizationBySlug(orgSlug);
        const org = JSON.parse(res.data) as Organization;

        setOrg(org);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetOrg();
  }, [orgSlug]);

  // Fetch step completion status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
        setIsCompleted(publicMetadata.lastOnboardingStepCompleted >= currStep);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isCompleted) fetchUser();
  }, [lastUpdated]);

  if (!user || !isLoaded) return;
  return (
    <div className="pt-5">
      {!isCompleted ||
      (step === 2 && isEditing) ||
      !metadata.invitations ||
      metadata.invitations.length === 0 ? (
        // Request to join
        <div className="flex flex-col">
          <div className="flex justify-between">
            <OrgSearch />
            <Button
              className=""
              onClick={handleRequestToJoin}
              disabled={orgSlug === "" || orgSearch === ""}
            >
              Request to join
            </Button>
          </div>

          {/* TODO: Possibly add a "Skip this step" button with a "link" variant */}
        </div>
      ) : (
        // View or edit request to join
        <ViewOrEditRequestToJoin />
      )}
    </div>
  );
}

function OrgSearch() {
  const { showOrgResults, orgSearch, setOrgSearch } = useOnboardingContext();
  const [orgSlug] = useQueryState("orgSlug", { defaultValue: "" });

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="organizations"
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={10} />
      <div className="ais-InstantSearch-inline">
        <ControlledSearchBox value={orgSearch} setValue={setOrgSearch} />
        {showOrgResults && (
          <EmptyQueryBoundary fallback={null}>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits
                hitComponent={Hit}
                classNames={{
                  list: "ais-Hits-list-inline",
                  item: "ais-Hits-item-inline",
                }}
              />
            </NoResultsBoundary>
          </EmptyQueryBoundary>
        )}
      </div>
    </InstantSearch>
  );
}

function ControlledSearchBox({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  const { orgSearch, setOrgSearch, setShowOrgResults } = useOnboardingContext();
  const { query, refine } = useSearchBox();
  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep Algolia's internal state in sync with `value` prop
  useEffect(() => {
    if (value !== query) {
      refine(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowOrgResults(true)}
        onBlur={() => setShowOrgResults(false)}
        placeholder="Search for an organization..."
        className={`border p-2 rounded-lg text-xs ${orgSlug !== "" && "focus:rounded-b-none"}`}
      />

      {orgSearch !== "" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            setOrgSlug("");
            setOrgSearch("");
            inputRef.current?.focus();
          }}
        >
          <MdClose className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Clear search bar</span>
        </Button>
      )}
    </div>
  );
}

function Hit({ hit }: { hit: any }) {
  const { setOrgSearch, setShowOrgResults } = useOnboardingContext();
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  return (
    <Button
      variant="ghost"
      className="size-full flex flex-col items-start gap-1 rounded-none"
      onMouseDown={() => {
        setOrgSlug(hit.publicMetadata.slug);
        setOrgSearch(hit.publicMetadata.slug);
        setShowOrgResults(false);
      }}
    >
      {/* Name and Slug */}
      <div className="flex gap-1.5 items-baseline">
        <div className="text-sm font-bold">
          <Highlight
            attribute="publicMetadata.name"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {"@"}
          <Highlight
            attribute="publicMetadata.slug"
            hit={hit}
            classNames={{ highlighted: "highlighted-hits" }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="text-xs text-muted-foreground">
        <Highlight
          attribute="publicMetadata.category"
          hit={hit}
          classNames={{ highlighted: "highlighted-hits" }}
        />
      </div>
    </Button>
  );
}

function EmptyQueryBoundary({
  children,
  fallback,
}: {
  children: any;
  fallback: any;
}) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResultsBoundary({
  children,
  fallback,
}: {
  children: any;
  fallback: any;
}) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="ais-Hits-list-inline flex-row justify-center text-xs text-muted-foreground p-3">
      No results for "{indexUiState.query}"
    </div>
  );
}

function ViewOrEditRequestToJoin() {
  const { isLoading, setIsLoading, setCurrOnboardingStep, setLastUpdated } =
    useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [orgs, setOrgs] = useState<Organization[]>();
  const metadata = user?.publicMetadata as any as UserMetadata;
  const invitations = metadata.invitations;

  function findOrg(orgId: string) {
    if (!orgs) return undefined;
    for (const org of orgs) {
      if (org.id === orgId) return org;
    }
    return undefined;
  }

  const handleCancelRequestToJoin = async (targetOrgId: string) => {
    if (!user) return;

    const userMetadata = user.publicMetadata as any as UserMetadata;
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
      lastOnboardingStepCompleted: 2,
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
      .then((res) => {
        setIsLoading(false);
        setCurrOnboardingStep({ step: 2, isEditing: true }); // TODO: Do we need this?
        setLastUpdated(new Date().toString()); // Triggers Profile.tsx and JoinOrg.tsx to re-render.

        toast({
          variant: res.success ? "default" : "destructive",
          title: res.message?.title,
          description: res.message?.description,
          action: (
            <ToastAction
              altText={res.success ? "Dismiss" : "Try again"}
              className="flex gap-2"
              onClick={() => {
                if (!res.success) handleCancelRequestToJoin(targetOrgId);
              }}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);

        toast({
          variant: "destructive",
          title: "Error updating profile",
          description:
            "There was an issue updating your profile. Try again or contact support if the issue persists.",
          action: (
            <ToastAction
              altText="Try again"
              className="flex gap-2"
              onClick={() => handleCancelRequestToJoin(targetOrgId)}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      });
  };

  // Fetch organization info for invitations
  useEffect(() => {
    const fetchAndSetOrgs = async () => {
      setIsLoading(true);
      if (!invitations) return;
      try {
        const result = [];
        for (const invitation of invitations) {
          const res = await getOrganizationById(invitation.organizationId);
          const org = JSON.parse(res.data) as Organization;
          result.push(org);
        }

        setOrgs(result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetOrgs();
  }, []);

  if (!user || !isLoaded) return;
  return (
    <div className="flex flex-col">
      {/* TODO: Add a loading UI for table  */}
      {(!orgs || !invitations) && <>Loading...</>}
      {orgs && invitations && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Organization</TableHead>
              <TableHead>Request sent</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations?.map((invitation, i) => (
              <TableRow key={i}>
                <TableCell className="text-center font-medium">
                  {findOrg(invitation.organizationId)?.name}
                </TableCell>
                <TableCell>
                  {formatRelative(
                    new Date(invitation.createdAt),
                    new Date()
                    // , { locale: es } // TODO: Add locale functionality
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={invitation.status.toLowerCase()}>
                    {invitation.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                      handleCancelRequestToJoin(invitation.organizationId);
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
      )}
    </div>
  );
}
