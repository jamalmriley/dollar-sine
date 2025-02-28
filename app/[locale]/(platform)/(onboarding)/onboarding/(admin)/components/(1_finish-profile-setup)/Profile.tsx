import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { MdClose } from "react-icons/md";
import FinishProfileSetup from "./FinishProfileSetup";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { ProfileMetadata } from "@/utils/api";
// import { isEmptyObject } from "@/utils/general";
// import { currentUser } from "@clerk/nextjs/server";

export default function Profile() {
  const [, setPrefix] = useQueryState("prefix", { defaultValue: "" });
  const [, setDisplayName] = useQueryState("displayName", { defaultValue: "" });
  const [, setDisplayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });
  const [, setJobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [, setPronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [, setSkinTone] = useQueryState("skinTone", { defaultValue: "" });

  const { isUpdatingProfile, setIsUpdatingProfile, setProfilePic } =
    useOnboardingContext();

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

/* export const isFinishProfileSetupCompleted = async (): Promise<boolean> => {
  const res = await currentUser()
    .then((user) => {
      const metadata = user?.publicMetadata;
      if (!user || !metadata || isEmptyObject(metadata)) return false;

      const { prefix, displayName, jobTitle, pronouns, skinTone } =
        metadata.profile as ProfileMetadata;

      return (
        prefix !== "" &&
        displayName !== "" &&
        jobTitle !== "" &&
        pronouns !== "" &&
        skinTone !== ""
      );
    })
    .catch((err) => {
      console.error(err);
      return false;
    });

  return res;
}; */
export const isFinishProfileSetupCompleted = () => true;
