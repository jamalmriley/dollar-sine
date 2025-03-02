import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { ProfileMetadata, UserData } from "@/utils/api";
import { EMOJIS, SkinTone } from "@/utils/emoji";
import { formatRelative } from "date-fns";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { MdAlternateEmail, MdEdit, MdEmail, MdError } from "react-icons/md";
import { TbUserExclamation } from "react-icons/tb";

export function ProfileCard({
  toggle,
  userData,
}: {
  toggle: boolean;
  userData: UserData;
}) {
  const metadata = userData.publicMetadata.profile as ProfileMetadata;

  const [, setPrefix] = useQueryState("prefix", { defaultValue: "" });
  const [, setDisplayName] = useQueryState("displayName", { defaultValue: "" });
  const [, setDisplayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });
  const [, setJobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [, setPronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [, setSkinTone] = useQueryState("skinTone", { defaultValue: "" });

  const {
    setIsUpdatingProfile,
    setIsHeSelected,
    setIsSheSelected,
    setIsTheySelected,
  } = useOnboardingContext();

  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* User Image */}
        <div className={`expandable-content ${toggle ? "size-32" : "size-24"}`}>
          <Image
            src={userData.imageUrl}
            width={0}
            height={0}
            sizes="100vw"
            alt={userData.id}
            loading="eager"
            className="w-full h-auto rounded-lg overflow-hidden"
          />
        </div>

        {/* User Details */}
        <div className="flex grow flex-col justify-between">
          {/* User Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">
                {metadata.displayName}{" "}
                {EMOJIS.handWave[metadata.skinTone as SkinTone]}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  const pronounsHelper = (pronouns: string) => {
                    const arr = pronouns.split("/");

                    for (const pronoun of arr) {
                      if (pronoun === "he") setIsHeSelected(true);
                      else if (pronoun === "she") setIsSheSelected(true);
                      else if (pronoun === "they") setIsTheySelected(true);
                    }
                  };

                  setIsUpdatingProfile(true);
                  setPrefix(metadata.prefix);
                  setDisplayName(metadata.displayName);
                  setDisplayNameFormat(metadata.displayNameFormat);
                  setJobTitle(metadata.jobTitle);
                  setPronouns(metadata.pronouns);
                  pronounsHelper(metadata.pronouns);
                  setSkinTone(metadata.skinTone);
                }}
              >
                <span className="sr-only">Edit user</span>
                <MdEdit />
              </Button>
            </div>
            <span className="text-sm">{metadata.jobTitle}</span>
            <span className="text-sm">Pronouns: {metadata.pronouns}</span>
          </div>

          {/* User Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* User Expanded Details */}
            <div
              className={`flex flex-col expandable-content overflow-hidden ${
                toggle ? "h-10" : "h-0"
              }`}
            >
              <span className="flex items-center text-xs text-muted-foreground hover:underline">
                <MdEmail className="size-5 p-0.5 mr-2" />
                <span>{userData.emailAddresses[0].emailAddress}</span>
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <MdAlternateEmail className="size-5 p-0.5 mr-2" />
                <span>{userData.id}</span>
              </span>
            </div>

            {/* Creation Date */}
            <span className="text-xs text-muted-foreground">
              User created{" "}
              {formatRelative(
                new Date(userData.createdAt!),
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

export function ProfileCardSkeleton({ toggle }: { toggle: boolean }) {
  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* User Image */}
        <Skeleton className="aspect-square h-full rounded-lg overflow-hidden" />

        {/* User Details */}
        <div className="flex grow flex-col justify-between">
          {/* User Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <Skeleton className="w-32 h-6 my-0.5" />
              <Skeleton className="size-9 rounded-full" />
            </div>

            <Skeleton className="w-36 h-4 my-0.5" />
            <Skeleton className="w-28 h-4 my-0.5" />
          </div>

          {/* User Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* User Expanded Details */}
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
                <Skeleton className="w-32 h-3 my-0.5 mr-2" />
              </span>
            </div>

            {/* Creation Date */}
            <Skeleton className="w-28 h-3 my-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileCardError({ toggle }: { toggle: boolean }) {
  const { setLastUpdated } = useOnboardingContext();
  return (
    <div className="p-5 w-full">
      <div
        className={`expandable-content ${
          toggle ? "h-32" : "h-24"
        } flex gap-5 select-none`}
      >
        {/* User Image */}
        <div className="aspect-square h-full rounded-lg overflow-hidden bg-primary-foreground">
          <TbUserExclamation className="w-3/4 h-full mx-auto" />
        </div>

        {/* User Details */}
        <div className="flex grow flex-col justify-between">
          {/* User Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">User not found</span>
            </div>

            <span className="text-sm">
              We couldn&apos;t load this user&apos;s info.
            </span>
          </div>

          {/* User Expanded Details and Creation Date */}
          <div className="flex flex-col">
            {/* User Expanded Details */}
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
