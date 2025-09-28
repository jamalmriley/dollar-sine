import { Separator } from "@/components/ui/separator";
import Prefix from "./Prefix";
import DisplayName from "./DisplayName";
import JobTitle from "./JobTitle";
import Pronouns from "./Pronouns";
import SkinTone from "./SkinTone";
import ProfileImageUpload from "./ProfileImageUpload";
import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";
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
import { MdClose, MdRefresh } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminMetadata, GuardianMetadata, TeacherMetadata } from "@/types/user";
import { updateUserMetadata } from "@/app/actions/onboarding";
import { ToastAction } from "@/components/ui/toast";
import { EMOJI_SKIN_TONES } from "@/utils/emoji";
import Pronunciation from "./Pronunciation";
import { StyledButton } from "@/components/StyledButton";
import Students from "./Students";
import { useResetQueryState } from "@/hooks/use-resetQueryState";

export default function FinishProfile() {
  const {
    isLoading,
    setIsLoading,
    currOnboardingStep,
    setCurrOnboardingStep,
    profilePic,
    setProfilePic,
    userMetadata,
    setSelectedPronouns,
    setLastUpdated,
  } = useOnboardingContext();
  const [pronunciation] = useQueryState("pronunciation", { defaultValue: "" });
  const [prefix] = useQueryState("prefix", { defaultValue: "" });
  const [isPrefixIncluded] = useQueryState(
    "isPrefixIncluded",
    parseAsBoolean.withDefault(true)
  );
  const [isCustomPrefix] = useQueryState(
    "isCustomPrefix",
    parseAsBoolean.withDefault(false)
  );
  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const [displayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });
  const [jobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [pronouns] = useQueryState("pronouns", {
    defaultValue: "",
  });
  const [hasCustomPronouns] = useQueryState(
    "hasCustomPronouns",
    parseAsBoolean.withDefault(false)
  );
  const [emojiSkinTone] = useQueryState(
    "emojiSkinTone",
    parseAsStringLiteral(EMOJI_SKIN_TONES).withDefault("default")
  );
  const { reset } = useResetQueryState();
  const { user, isLoaded } = useUser();

  if (!userMetadata) return;

  const { lastOnboardingStepCompleted, organizations, role } = userMetadata;
  const canRender: boolean = Boolean(
    role === "admin" ||
      role === "teacher" ||
      (role === "guardian" &&
        lastOnboardingStepCompleted >= 1 &&
        organizations &&
        organizations.length > 0) // TODO: Change organizations && organizations.length > 0 to org.id is in the organizations array.
  );
  const currStep = role === "guardian" ? 2 : 1;

  const hasProfileUpdated: boolean =
    userMetadata.pronunciation !== pronunciation ||
    ("prefix" in userMetadata && userMetadata.prefix !== prefix) ||
    ("displayName" in userMetadata &&
      userMetadata.displayName !== displayName) ||
    ("displayNameFormat" in userMetadata &&
      userMetadata.displayNameFormat !== displayNameFormat) ||
    userMetadata.pronouns !== pronouns ||
    userMetadata.emojiSkinTone !== emojiSkinTone ||
    ("jobTitle" in userMetadata && userMetadata.jobTitle !== jobTitle);

  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= currStep &&
    currOnboardingStep.step === currStep &&
    currOnboardingStep.isEditing;

  const hasEmptyField: boolean =
    !pronunciation ||
    (canRender && !prefix) ||
    (canRender && !displayName) ||
    (canRender && !displayNameFormat) ||
    (role !== "guardian" && !jobTitle) ||
    !pronouns ||
    !emojiSkinTone ||
    (role === "guardian" && !Boolean("studentInvitations" in userMetadata));

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

    const updatedGuardianMetadata: GuardianMetadata = {
      ...userMetadata,
      pronunciation,
      isOnboardingComplete: false,
      lastOnboardingStepCompleted: Math.max(
        currStep,
        userMetadata.lastOnboardingStepCompleted
      ),
      onboardingLink: "/onboarding",
      pronouns,
      hasCustomPronouns,
      emojiSkinTone,
      displayName: displayName || user.fullName,
      displayNameFormat: displayNameFormat || "Full Name",
      prefix,
      isPrefixIncluded,
      isCustomPrefix,
    };
    const updatedTeacherMetadata: TeacherMetadata = {
      ...updatedGuardianMetadata,
      jobTitle,
    };
    const updatedAdminMetadata: AdminMetadata = { ...updatedTeacherMetadata };

    let updatedMetadata:
      | AdminMetadata
      | TeacherMetadata
      | GuardianMetadata
      | null;

    switch (role) {
      case "admin":
        updatedMetadata = updatedAdminMetadata;
        break;
      case "teacher":
        updatedMetadata = updatedTeacherMetadata;
        break;
      case "guardian":
        updatedMetadata = updatedGuardianMetadata;
        break;
      default:
        updatedMetadata = null;
    }

    const formData = new FormData();
    if (profilePic) formData.append("profilePic", profilePic);

    await updateUserMetadata(userId, updatedMetadata, formData)
      .then(() => {
        reset();
        setIsLoading(false);
        setCurrOnboardingStep({ step: 1, isEditing: false });
        setLastUpdated(new Date().toString()); // Triggers re-render.

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
    <div className="size-full flex justify-center">
      <Card className="h-fit w-96 md:w-[48rem] mx-10 expandable-content max-h-[36rem] overflow-y-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="h2">{header.title}</CardTitle>
            {isUpdating && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-5 lg:size-6"
                onClick={() => {
                  reset();
                  setCurrOnboardingStep({ step: 1, isEditing: false });
                  setSelectedPronouns([]);
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

            <div className="block md:hidden -mt-5">
              <FinishProfileMobile />
            </div>

            <div className="flex grow items-end">
              <StyledButton
                buttonType="action"
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
              </StyledButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FinishProfileDesktop() {
  const { userMetadata, org } = useOnboardingContext();

  if (!userMetadata) return;
  const { lastOnboardingStepCompleted, organizations, role } = userMetadata;
  const canRender: boolean = Boolean(
    role === "admin" ||
      role === "teacher" ||
      (role === "guardian" &&
        lastOnboardingStepCompleted >= 1 &&
        organizations &&
        org &&
        organizations.includes(org.id))
  );
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <Pronunciation />
        <Separator decorative />
        {canRender && <Prefix />}
        {canRender && <Separator decorative />}
        {canRender && <DisplayName />}
        {!canRender && <Pronouns />}
        {!canRender && <Separator decorative />}
        {!canRender && <SkinTone />}
        {!canRender && <Separator decorative />}
        {!canRender && <ProfileImageUpload />}
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
        {role !== "guardian" && <JobTitle />}
        {role === "guardian" && <Students canRender={canRender} />}
        {canRender && <Separator decorative />}
        {canRender && <Pronouns />}
        {canRender && <Separator decorative />}
        {canRender && <SkinTone />}
        {canRender && <Separator decorative />}
        {canRender && <ProfileImageUpload />}
      </div>
    </div>
  );
}

function FinishProfileMobile() {
  const { profilePic, userMetadata } = useOnboardingContext();
  const [pronunciation] = useQueryState("pronunciation", { defaultValue: "" });
  const [prefix] = useQueryState("prefix", { defaultValue: "" });
  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const [jobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [pronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [emojiSkinTone] = useQueryState("emojiSkinTone", { defaultValue: "" });

  if (!userMetadata) return;
  const { lastOnboardingStepCompleted, organizations, role } = userMetadata;
  const canRender: boolean = Boolean(
    role === "admin" ||
      role === "teacher" ||
      (role === "guardian" &&
        lastOnboardingStepCompleted >= 1 &&
        organizations &&
        organizations.length > 0) // TODO: Change organizations && organizations.length > 0 to org.id is in the organizations array.
  );
  const isStudentInvitationsComplete =
    "studentInvitations" in userMetadata &&
    Array.isArray(userMetadata.studentInvitations) &&
    userMetadata.studentInvitations.length > 0;

  const accordionItems = [
    {
      trigger: "Tell us how to say your name.",
      value: "pronunciation",
      content: <Pronunciation />,
      canRender: true,
      isCompleted: pronunciation !== "",
    },
    {
      trigger: "Select a prefix below.",
      value: "prefix",
      content: <Prefix />,
      canRender,
      isCompleted: prefix !== "",
    },
    {
      trigger: "Choose a display name format.",
      value: "displayName",
      content: <DisplayName />,
      canRender,
      isCompleted: displayName !== "",
    },
    {
      trigger: "Set your job title.",
      value: "jobTitle",
      content: <JobTitle />,
      canRender: role !== "guardian",
      isCompleted: jobTitle !== "",
    },
    {
      trigger: "Add your pronouns.",
      value: "pronouns",
      content: <Pronouns />,
      canRender: true,
      isCompleted: pronouns !== "",
    },
    {
      trigger: "Select your skin tone.",
      value: "emojiSkinTone",
      content: <SkinTone />,
      canRender: true,
      isCompleted: emojiSkinTone !== "",
    },
    {
      trigger: "Add your students.",
      value: "students",
      content: <Students canRender={!canRender} />,
      canRender: role === "guardian",
      isCompleted: isStudentInvitationsComplete,
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Profile Items */}
      {accordionItems
        .filter((item) => item.canRender)
        .map((item, i) => (
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
            <AccordionContent className="pr-1">{item.content}</AccordionContent>
          </AccordionItem>
        ))}

      {/* Profile Pic */}
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
