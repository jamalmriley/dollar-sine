import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { MdClose } from "react-icons/md";
import FinishProfileSetup from "./FinishProfileSetup";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";
import { useUser } from "@clerk/nextjs";
import { ProfileMetadata } from "@/utils/onboarding";

export default function Profile() {
  const { isUpdatingProfile, setIsUpdatingProfile, setProfilePic } =
    useOnboardingContext();

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

  const header = {
    title: isUpdatingProfile
      ? "Update your profile."
      : isFinishProfileSetupCompleted()
      ? "You finished setting up your profile!"
      : "Finish setting up your profile.",
    description: "",
    // description: isUpdatingProfile
    //   ? "Need to make a quick edit? Update your profile below."
    //   : isFinishProfileSetupCompleted()
    //   ? "View your profile's details below."
    //   : "Update your profile below.",
  };

  return (
    <div
      className={`w-full h-full ${
        isUpdatingProfile ? "max-w-3xl" : "max-w-lg"
      } flex flex-col md:border rounded-lg px-10 md:px-5 py-5 gap-4 md:bg-primary-foreground`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="h2">{header.title}</h2>
          {isUpdatingProfile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setIsUpdatingProfile(false);
                setPrefix("");
                setDisplayName("");
                setDisplayNameFormat("");
                setJobTitle("");
                setPronouns("");
                setSkinTone("");
                setProfilePic(undefined);
              }}
            >
              <span className="sr-only">Cancel updating my profile</span>
              <MdClose />
            </Button>
          )}
        </div>
        {header.description !== "" && (
          <span className="subtitle">{header.description}</span>
        )}
      </div>

      {isUpdatingProfile ? (
        <FinishProfileSetup />
      ) : isFinishProfileSetupCompleted() ? (
        <ProfileAlreadyCreated />
      ) : (
        <FinishProfileSetup />
      )}
    </div>
  );
}

export const isFinishProfileSetupCompleted = (): boolean => {
  const { user } = useUser();
  if (!user) return false;

  const { prefix, displayName, jobTitle, pronouns, skinTone } = user
    .publicMetadata.profile as ProfileMetadata;

  return (
    prefix !== "" &&
    displayName !== "" &&
    jobTitle !== "" &&
    pronouns !== "" &&
    skinTone !== ""
  );
};
