import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { OrgData } from "@/utils/api";
import { truncateString } from "@/utils/general";
import { formatRelative } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";
import { BsBuildingExclamation } from "react-icons/bs";
import { IoMdLink } from "react-icons/io";
import { MdEdit, MdError } from "react-icons/md";
import { TbAuth2Fa } from "react-icons/tb";

export function OrgCard({
  toggle,
  orgData,
}: {
  toggle: boolean;
  orgData: OrgData;
}) {
  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });

  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });

  const [is2FARequired, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

  function splitAddress(address: string) {
    const separator = ",";
    const addressArr = address.split(separator);

    let address1: string = addressArr[0].trim();
    let address2: string = [...addressArr].slice(1).join(separator).trim();

    return { address1, address2 };
  }

  const { setIsUpdatingOrg } = useOnboardingContext();

  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* Org Image */}
        <img
          src={orgData.imageUrl}
          alt={orgData.name}
          className="aspect-square h-full rounded-lg overflow-hidden"
        />

        {/* Org Details */}
        <div className="flex grow flex-col justify-between">
          {/* Org Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">{orgData.name}</span>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  setIsUpdatingOrg(true);
                  setOrgName(orgData.name);
                  setOrgAddress(
                    String(orgData.publicMetadata.organizationAddress)
                  );
                  setOrgSlug(orgData.slug);
                  setIs2FARequired(
                    Boolean(orgData.publicMetadata.is2FARequired)
                  );
                }}
              >
                <span className="sr-only">Edit organization</span>
                <MdEdit />
              </Button>
            </div>
            <span className="text-sm">
              {truncateString(
                splitAddress(String(orgData.publicMetadata.organizationAddress))
                  .address1,
                40
              )}
            </span>
            <span className="text-sm">
              {truncateString(
                splitAddress(String(orgData.publicMetadata.organizationAddress))
                  .address2,
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
              <span className="flex items-center text-xs text-muted-foreground hover:underline">
                <IoMdLink className="size-5 mr-2" />
                dollarsi.ne/{orgData.slug}
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <TbAuth2Fa className="size-5 mr-2" />
                <span>
                  {Boolean(orgData.publicMetadata.is2FARequired)
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </span>
            </div>

            {/* Creation Date */}
            <span className="text-xs text-muted-foreground">
              Organization created{" "}
              {formatRelative(
                new Date(orgData.createdAt),
                new Date()
                // , { locale: es } // TODO: Add locale functionality
              )}
            </span>
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
        <div className="aspect-square h-full rounded-lg overflow-hidden bg-primary-foreground">
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
              We couldn't load this organization's info.
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

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                const value = new Date().toString();
                setLastUpdated(value);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
