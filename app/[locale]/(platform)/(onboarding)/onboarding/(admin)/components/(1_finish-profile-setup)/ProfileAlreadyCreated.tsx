import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { ProfileMetadata } from "@/utils/onboarding";
import { useUser } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

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
    <div className="flex flex-col border rounded-lg overflow-hidden">
      {/* Org Content */}
      <div className="p-5 w-full">
        <div
          className={`expandable-content ${
            toggle ? "h-32" : "h-24"
          } flex gap-5 select-none`}
        >
          {/* Org Image */}
          <img
            src={user.imageUrl}
            alt={user.id}
            className="aspect-square h-full rounded-lg overflow-hidden"
          />

          {/* Org Details */}
          <div className="flex grow flex-col justify-between">
            {/* Org Basic Details */}
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-center">
                <span className="text-lg font-bold">
                  {metadata.displayName} ({metadata.pronouns})
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
                  <span className="sr-only">Edit organization</span>
                  <MdEdit />
                </Button>
              </div>
              <span className="text-sm">{metadata.jobTitle}</span>
            </div>

            {/* Org Expanded Details and Creation Date */}
            <div className="flex flex-col">
              {/* Org Expanded Details */}
              <div
                className={`flex flex-col expandable-content overflow-hidden ${
                  toggle ? "h-10" : "h-0"
                }`}
              >
                {/* <span className="flex items-center text-xs text-muted-foreground hover:underline">
                  <IoMdLink className="size-5 mr-2" />
                  dollarsi.ne/{organization.slug}
                </span> */}
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
        className="rounded-none border-t"
        onClick={() => setToggle((prev) => !prev)}
      >
        <span className="sr-only">
          {toggle
            ? "Show less organization details"
            : "Show more organization details"}
        </span>
        {toggle ? <FaChevronUp /> : <FaChevronDown />}
      </Button>
    </div>
  );
}
