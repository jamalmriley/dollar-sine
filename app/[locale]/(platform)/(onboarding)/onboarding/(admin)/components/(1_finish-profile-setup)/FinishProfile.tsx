import { Separator } from "@/components/ui/separator";
import Prefix from "./Prefix";
import DisplayName from "./DisplayName";
import JobTitle from "./JobTitle";
import Pronouns from "./Pronouns";
import SkinTone from "./SkinTone";
import ProfileImageUpload from "./ProfileImageUpload";
import { parseAsStringLiteral, useQueryState } from "nuqs";
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
import { isEmptyObject } from "@/utils/general";
import { MdClose, MdRefresh } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminMetadata } from "@/types/user";
import { updateUserMetadata } from "@/app/actions/onboarding";
import { ToastAction } from "@/components/ui/toast";
import { EMOJI_SKIN_TONES } from "@/utils/emoji";

export default function FinishProfile() {
  const {
    isLoading,
    setIsLoading,
    currOnboardingStep,
    setCurrOnboardingStep,
    profilePic,
    setProfilePic,
    setIsHeSelected,
    setIsSheSelected,
    setIsTheySelected,
    setLastUpdated,
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
  const [emojiSkinTone, setEmojiSkinTone] = useQueryState(
    "emojiSkinTone",
    parseAsStringLiteral(EMOJI_SKIN_TONES).withDefault("default")
  );

  const { user, isLoaded } = useUser();
  if (!user || !isLoaded) return;

  const metadata = user.publicMetadata as any as AdminMetadata;

  const hasProfileUpdated: boolean =
    !user || isEmptyObject(metadata)
      ? false
      : metadata.prefix !== prefix ||
        metadata.displayName !== displayName ||
        metadata.displayNameFormat !== displayNameFormat ||
        metadata.jobTitle !== jobTitle ||
        metadata.pronouns.toString() !== pronouns?.toString() ||
        metadata.emojiSkinTone !== emojiSkinTone;

  const isUpdating =
    metadata.lastOnboardingStepCompleted >= 1 &&
    currOnboardingStep.step === 1 &&
    currOnboardingStep.isEditing;

  const hasEmptyField: boolean =
    !prefix ||
    !displayName ||
    !displayNameFormat ||
    !jobTitle ||
    !pronouns ||
    !emojiSkinTone;

  const header = {
    title: isUpdating
      ? "Update your profile."
      : "Finish setting up your profile.",
    description: isUpdating
      ? "Need to make a quick edit? Update your profile below."
      : "Update your profile below.",
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!user || !isLoaded) return;

    e.preventDefault();
    setIsLoading(true);

    const userId = user.id;
    const metadata: AdminMetadata = {
      role: "admin",
      isOnboardingCompleted: false,
      lastOnboardingStepCompleted: 1, // TODO: Do not override
      onboardingLink: "/onboarding",
      pronouns,
      emojiSkinTone,
      organizations: [], // TODO: Do not override
      courses: [], // TODO: Do not override
      classes: null, // TODO: Do not override
      displayName,
      displayNameFormat,
      prefix,
      jobTitle,
    };

    const formData = new FormData();
    if (profilePic) formData.append("profilePic", profilePic);

    await updateUserMetadata(userId, metadata, formData)
      .then(() => {
        setPrefix("");
        setDisplayName("");
        setDisplayNameFormat("");
        setJobTitle("");
        setPronouns("");
        setEmojiSkinTone("default");
        setIsLoading(false);
        setCurrOnboardingStep({ step: 1, isEditing: false });
        setLastUpdated(new Date().toString()); // Triggers Profile.tsx and ProfileAlreadyCreated.tsx to re-render.

        toast({
          variant: "default",
          title: "Profile successfully updated ✅",
          description: "You can now refresh or exit the page if needed.",
        });
      })
      .catch(() => {
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
              onClick={() => handleSubmit(e)}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      });
  };

  return (
    <Card className="w-full h-full mx-10 max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          {isUpdating && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-5 lg:size-6"
              onClick={() => {
                setCurrOnboardingStep({ step: 1, isEditing: false });
                setPrefix("");
                setDisplayName("");
                setDisplayNameFormat("");
                setJobTitle("");
                setPronouns("");
                setIsHeSelected(false);
                setIsSheSelected(false);
                setIsTheySelected(false);
                setEmojiSkinTone("default");
                setProfilePic(undefined);
              }}
            >
              <span className="sr-only">Cancel updating my profile</span>
              <MdClose />
            </Button>
          )}
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col gap-5"
        >
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
              // If the user's profile is being updated, see if at least a new avatar has been uploaded.
              // If so, the button should not be disabled.
              // If not, make sure no text fields are blank and that there is at least one change to update.
              disabled={
                isLoading ||
                (isUpdating
                  ? profilePic
                    ? false
                    : hasEmptyField || !hasProfileUpdated
                  : hasEmptyField)
              }
            >
              {isLoading && <Loader2 className="animate-spin" />}
              {isUpdating
                ? isLoading
                  ? "Updating your profile..."
                  : "Update profile"
                : isLoading
                ? "Updating your profile..."
                : "Finish your profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
  const [emojiSkinTone] = useQueryState("emojiSkinTone", { defaultValue: "" });

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
      isCompleted: pronouns && pronouns.length > 0,
    },
    {
      trigger: "Select your skin tone.",
      value: "emojiSkinTone",
      content: <SkinTone />,
      isCompleted: emojiSkinTone !== "",
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
