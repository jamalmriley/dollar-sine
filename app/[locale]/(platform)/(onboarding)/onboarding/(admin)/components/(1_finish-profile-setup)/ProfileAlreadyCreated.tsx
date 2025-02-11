import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { emojis, SkinTone } from "@/utils/emoji";
import { ProfileMetadata } from "@/utils/onboarding";
import { useUser } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdAlternateEmail, MdEdit, MdEmail } from "react-icons/md";

export default function ProfileAlreadyCreated() {
  const { user, isLoaded } = useUser();
  if (!user || !isLoaded) return;

  const { setIsUpdatingProfile } = useOnboardingContext();
  const [toggle, setToggle] = useState(false);
  const metadata = user.publicMetadata.profile as ProfileMetadata;

  const [prefix, setPrefix] = useQueryState("prefix", {
    defaultValue: "",
  });
  const [displayName, setDisplayName] = useQueryState("displayName", {
    defaultValue: "",
  });
  const [displayNameFormat, setDisplayNameFormat] = useQueryState(
    "displayNameFormat",
    {
      defaultValue: "",
    }
  );
  const [jobTitle, setJobTitle] = useQueryState("jobTitle", {
    defaultValue: "",
  });
  const [pronouns, setPronouns] = useQueryState("pronouns", {
    defaultValue: "",
  });
  const [skinTone, setSkinTone] = useQueryState("skinTone", {
    defaultValue: "",
  });

  return (
    <div className="flex flex-col border border-default-color rounded-lg overflow-hidden">
      {/* User Content */}
      <div className="p-5 w-full">
        <div
          className={`expandable-content ${
            toggle ? "h-32" : "h-24"
          } flex gap-5 select-none`}
        >
          {/* User Image */}
          <img
            src={user.imageUrl}
            alt={user.id}
            className="aspect-square h-full rounded-lg overflow-hidden"
          />

          {/* User Details */}
          <div className="flex grow flex-col justify-between">
            {/* User Basic Details */}
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-center">
                <span className="text-lg font-bold">
                  {metadata.displayName}{" "}
                  {emojis.handWave[metadata.skinTone as SkinTone]}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setIsUpdatingProfile(true);
                    setPrefix(metadata.prefix);
                    setDisplayName(metadata.displayName);
                    setDisplayNameFormat(metadata.displayNameFormat);
                    setJobTitle(metadata.jobTitle);
                    setPronouns(metadata.pronouns);
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
                <span className="flex items-center text-xs text-muted-foreground">
                  <MdEmail className="size-5 p-0.5 mr-2" />
                  <span>{user.emailAddresses[0].emailAddress}</span>
                </span>
                <span className="flex items-center text-xs text-muted-foreground hover:underline">
                  <MdAlternateEmail className="size-5 p-0.5 mr-2" />
                  <span>{user.id}</span>
                </span>
              </div>

              {/* Creation Date */}
              <span className="text-xs text-muted-foreground">
                User created{" "}
                {formatRelative(
                  new Date(user.createdAt!),
                  new Date()
                  // , { locale: es } // TODO: Add locale functionality
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="bg-primary-foreground rounded-none border-t border-default-color"
        onClick={() => setToggle((prev) => !prev)}
      >
        <span className="sr-only">
          {toggle ? "Show less user details" : "Show more user details"}
        </span>
        {toggle ? <FaChevronUp /> : <FaChevronDown />}
      </Button>
    </div>
  );
}
