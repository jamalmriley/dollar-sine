import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { truncateString } from "@/utils/general";
import { OrganizationMetadata } from "@/types/user";
import { Organization } from "@clerk/nextjs/server";
import { formatRelative } from "date-fns";
import Image from "next/image";
import { parseAsBoolean, useQueryState } from "nuqs";
import { BsBuildingExclamation } from "react-icons/bs";
import { IoMdLink } from "react-icons/io";
import { MdEdit, MdError } from "react-icons/md";
import { TbAuth2Fa } from "react-icons/tb";

export function OrgCard({
  toggle,
  org,
}: {
  toggle: boolean;
  org: Organization;
}) {
  const [, setOrgName] = useQueryState("orgName", { defaultValue: "" });
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [, setOrgAddress] = useQueryState("orgAddress", { defaultValue: "" });
  const [, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

  function splitAddress(address: string) {
    const separator = ",";
    const addressArr = address.split(separator);

    const address1: string = addressArr[0].trim();
    const address2: string = [...addressArr].slice(1).join(separator).trim();

    return { address1, address2 };
  }

  const { setCurrOnboardingStep } = useOnboardingContext();
  const metadata = org.publicMetadata as any as OrganizationMetadata;

  if (!metadata) return;
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

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  setCurrOnboardingStep({ step: 2, isEditing: true });
                  setOrgName(org.name);
                  setOrgAddress(String(metadata.address));
                  setOrgSlug(org.slug);
                  setIs2FARequired(Boolean(metadata.is2FARequired));
                }}
              >
                <span className="sr-only">Edit organization</span>
                <MdEdit />
              </Button>
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
              <span className="flex items-center text-xs text-muted-foreground hover:underline">
                <IoMdLink className="size-5 mr-2" />
                dollarsi.ne/{org.slug}
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <TbAuth2Fa className="size-5 mr-2" />
                <span>
                  {Boolean(metadata.is2FARequired) ? "Enabled" : "Disabled"}
                </span>
              </span>
            </div>

            {/* Creation Date */}
            <span className="text-xs text-muted-foreground">
              Organization created{" "}
              {formatRelative(
                new Date(org.createdAt),
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
