import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { MdClose } from "react-icons/md";
import FinishProfileSetup from "./FinishProfileSetup";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileMetadata } from "@/utils/api";
import { isEmptyObject } from "@/utils/general";

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
    <Card
      className={`w-full h-full mx-10 ${
        isUpdatingProfile ? "max-w-3xl" : "max-w-lg"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          {isUpdatingProfile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-5 lg:size-6"
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
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {isUpdatingProfile ? (
          <FinishProfileSetup />
        ) : isFinishProfileSetupCompleted() ? (
          <ProfileAlreadyCreated />
        ) : (
          <FinishProfileSetup />
        )}
      </CardContent>
    </Card>
  );
}

export const isFinishProfileSetupCompleted = (): boolean => {
  const { user, isLoaded } = useUser();
  if (!user || !isLoaded) return false;

  const metadata = user.publicMetadata;
  if (isEmptyObject(metadata)) return false;

  const { prefix, displayName, jobTitle, pronouns, skinTone } =
    metadata.profile as ProfileMetadata;

  return (
    prefix !== "" &&
    displayName !== "" &&
    jobTitle !== "" &&
    pronouns !== "" &&
    skinTone !== ""
  );
};
