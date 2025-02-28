import { Separator } from "@/components/ui/separator";
import Prefix from "./Prefix";
import DisplayName from "./DisplayName";
import JobTitle from "./JobTitle";
import Pronouns from "./Pronouns";
import SkinTone from "./SkinTone";
import ProfileImageUpload from "./ProfileImageUpload";
import { useQueryState } from "nuqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaCheckCircle } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import { Loader2 } from "lucide-react";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { PostResponse, ProfileMetadata } from "@/utils/api";
import { isEmptyObject } from "@/utils/general";

export default function FinishProfileSetup() {
  const {
    isLoading,
    setIsLoading,
    isUpdatingProfile,
    setIsUpdatingProfile,
    profilePic,
  } = useOnboardingContext();
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

  const { user, isLoaded } = useUser();
  if (!user || !isLoaded) return;

  const metadata = user.publicMetadata.profile as ProfileMetadata;

  const hasProfileUpdated: boolean =
    !user || isEmptyObject(metadata)
      ? false
      : metadata.prefix !== prefix ||
        metadata.displayName !== displayName ||
        metadata.displayNameFormat !== displayNameFormat ||
        metadata.jobTitle !== jobTitle ||
        metadata.pronouns !== pronouns ||
        metadata.skinTone !== skinTone;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!user || !isLoaded) return;

    e.preventDefault();
    setIsLoading(true);

    const userId = user.id;
    const body: any = new FormData();
    await body.append("image", profilePic || null);
    await body.append("prefix", prefix);
    await body.append("displayName", displayName);
    await body.append("displayNameFormat", displayNameFormat);
    await body.append("jobTitle", jobTitle);
    await body.append("pronouns", pronouns);
    await body.append("skinTone", skinTone);

    await fetch(
      `/api/users/update?userId=${userId}&role=admin&relation=admin`,
      { method: "POST", body }
    )
      .then((res) => res.json())
      .then((json: PostResponse) => {
        setPrefix("");
        setDisplayName("");
        setDisplayNameFormat("");
        setJobTitle("");
        setPronouns("");
        setSkinTone("");
        setIsLoading(false);
        setIsUpdatingProfile(false);

        toast({
          variant: json.success ? "default" : "destructive",
          title: json.message.title,
          description: json.message.description,
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setIsUpdatingProfile(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-5">
      <div className="hidden md:block">
        <FinishProfileDesktop />
      </div>

      <div className="block md:hidden">
        <FinishProfileMobile />
      </div>

      <div className="flex grow items-end">
        <Button
          type="submit"
          className={`w-full ${
            isLoading &&
            "disabled:pointer-events-auto cursor-progress hover:bg-primary"
          }`}
          disabled={
            isLoading ||
            (isUpdatingProfile
              ? profilePic
                ? false
                : !prefix ||
                  !displayName ||
                  !displayNameFormat ||
                  !jobTitle ||
                  !pronouns ||
                  !skinTone ||
                  !hasProfileUpdated
              : !prefix ||
                !displayName ||
                !displayNameFormat ||
                !jobTitle ||
                !pronouns ||
                !skinTone)
          }
          // If the user's profile is being updated, see if at least a new avatar has been uploaded.
          // If so, the button should not be disabled.
          // If not, make sure no text fields are blank and that there is at least one change to update.
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isUpdatingProfile
            ? isLoading
              ? "Updating your profile..."
              : "Update profile"
            : isLoading
            ? "Updating your profile..."
            : "Finish your profile"}
        </Button>
      </div>
    </form>
  );
}

function FinishProfileDesktop() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Prefix />
          <Separator decorative />
          <DisplayName />
        </div>

        {/* Responsive Separator */}
        <div>
          <Separator
            decorative
            orientation="vertical"
            className="hidden md:block"
          />

          <Separator
            decorative
            orientation="horizontal"
            className="block md:hidden"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <JobTitle />
          <Separator decorative />
          <Pronouns />
          <Separator decorative />
          <SkinTone />
        </div>
      </div>

      <ProfileImageUpload />
    </div>
  );
}

function FinishProfileMobile() {
  const [prefix] = useQueryState("prefix", { defaultValue: "" });
  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const [jobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [pronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [skinTone] = useQueryState("skinTone", { defaultValue: "" });

  const accordionItems = [
    {
      trigger: "Select a prefix below.",
      value: "prefix",
      content: <Prefix />,
      isCompleted: prefix !== "",
    },
    {
      trigger: "Choose a display name format.",
      value: "displayName",
      content: <DisplayName />,
      isCompleted: displayName !== "",
    },
    {
      trigger: "Set your job title.",
      value: "jobTitle",
      content: <JobTitle />,
      isCompleted: jobTitle !== "",
    },
    {
      trigger: "Add your pronouns.",
      value: "pronouns",
      content: <Pronouns />,
      isCompleted: pronouns !== "",
    },
    {
      trigger: "Select your skin tone.",
      value: "skinTone",
      content: <SkinTone />,
      isCompleted: skinTone !== "",
    },
  ];

  const { profilePic } = useOnboardingContext();

  return (
    <Accordion type="single" collapsible className="w-full">
      {accordionItems.map((item, i) => (
        <AccordionItem key={i} value={item.value}>
          <AccordionTrigger>
            <span className="flex items-center gap-3">
              {/* Check */}
              <span className="size-4">
                {item.isCompleted ? (
                  <FaCheckCircle className="size-full text-emerald-400" />
                ) : (
                  <div className="size-full rounded-full border-2" />
                )}
              </span>

              {/* Label */}
              <span
                className={`text-sm font-semibold ${
                  item.isCompleted ? "text-muted-foreground line-through" : ""
                }`}
              >
                {item.trigger}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}

      <AccordionItem key={accordionItems.length} value="profilePic">
        <AccordionTrigger>
          <span className="flex items-center gap-3">
            {/* Check */}
            <span className="size-4">
              {profilePic ? (
                <FaCheckCircle className="size-full text-emerald-400" />
              ) : (
                <div className="size-full rounded-full border-2" />
              )}
            </span>

            {/* Label */}
            <span
              className={`text-sm font-semibold ${
                profilePic ? "text-muted-foreground line-through" : ""
              }`}
            >
              Optional: Upload a profile picture.
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ProfileImageUpload />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
