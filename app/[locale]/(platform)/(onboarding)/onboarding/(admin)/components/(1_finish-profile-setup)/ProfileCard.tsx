import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { EMOJI_SKIN_TONES, EMOJIS, EmojiSkinTone } from "@/utils/emoji";
import { AdminMetadata } from "@/types/user";
import { formatRelative } from "date-fns";
import Image from "next/image";
import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";
import { MdEdit, MdEmail, MdError } from "react-icons/md";
import { RiSpeakLine } from "react-icons/ri";
import { TbUserExclamation } from "react-icons/tb";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";

export function ProfileCard({
  toggle,
  userData,
}: {
  toggle: boolean;
  userData: User;
}) {
  const {
    setIsHeSelected,
    setIsSheSelected,
    setIsTheySelected,
    setCurrOnboardingStep,
  } = useOnboardingContext();

  const [, setPronunciation] = useQueryState("pronunciation", {
    defaultValue: "",
  });
  const [, setPrefix] = useQueryState("prefix", { defaultValue: "" });
  const [, setIsPrefixIncluded] = useQueryState(
    "isPrefixIncluded",
    parseAsBoolean.withDefault(true)
  );
  const [, setIsCustomPrefix] = useQueryState(
    "isCustomPrefix",
    parseAsBoolean.withDefault(false)
  );
  const [, setDisplayName] = useQueryState("displayName", { defaultValue: "" });
  const [, setDisplayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });
  const [, setJobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [, setPronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [, setHasCustomPronouns] = useQueryState(
    "hasCustomPronouns",
    parseAsBoolean.withDefault(false)
  );
  const [, setEmojiSkinTone] = useQueryState(
    "emojiSkinTone",
    parseAsStringLiteral(EMOJI_SKIN_TONES).withDefault("default")
  );

  const metadata = userData.publicMetadata as any as AdminMetadata;
  if (!metadata) return;
  const {
    pronunciation,
    prefix,
    isPrefixIncluded,
    isCustomPrefix,
    displayName,
    displayNameFormat,
    jobTitle,
    pronouns,
    hasCustomPronouns,
    emojiSkinTone,
  } = metadata;

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
            className="w-full h-auto border border-default-color rounded-lg overflow-hidden"
          />
        </div>

        {/* User Details */}
        <div className="flex grow flex-col justify-between">
          {/* User Basic Details */}
          <div className="flex flex-col">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold">
                {metadata.displayName}{" "}
                {EMOJIS.handWave[metadata.emojiSkinTone as EmojiSkinTone]}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  const pronounHelper = () => {
                    const splitPronouns = pronouns.split("/");
                    for (const pronoun of splitPronouns) {
                      if (pronoun === "he") setIsHeSelected(true);
                      if (pronoun === "she") setIsSheSelected(true);
                      if (pronoun === "they") setIsTheySelected(true);
                    }
                  };
                  setCurrOnboardingStep({ step: 1, isEditing: true });
                  if (pronunciation) setPronunciation(pronunciation);
                  if (prefix) setPrefix(prefix);
                  if (typeof isPrefixIncluded === "boolean")
                    setIsPrefixIncluded(isPrefixIncluded);
                  if (typeof isCustomPrefix === "boolean")
                    setIsCustomPrefix(isCustomPrefix);
                  if (displayName) setDisplayName(displayName);
                  if (displayNameFormat)
                    setDisplayNameFormat(displayNameFormat);
                  if (jobTitle) setJobTitle(jobTitle);
                  pronounHelper();
                  setPronouns(pronouns);
                  setHasCustomPronouns(false);
                  setEmojiSkinTone(emojiSkinTone);
                }}
              >
                <span className="sr-only">Edit user</span>
                <MdEdit />
              </Button>
            </div>
            <span className="text-sm">{metadata.jobTitle}</span>
            <span className="text-sm italic">{metadata.pronouns}</span>
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
                <Link
                  href={`mailto:${userData.emailAddresses[0].emailAddress}`}
                >
                  <span>{userData.emailAddresses[0].emailAddress}</span>
                </Link>
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <RiSpeakLine className="size-5 p-0.5 mr-2" />
                <span>Pronounces name {metadata.pronunciation}</span>
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
        <div className="aspect-square h-full rounded-lg border border-default-color overflow-hidden bg-primary-foreground">
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
