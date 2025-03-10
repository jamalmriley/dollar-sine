import { useOnboardingContext } from "@/contexts/onboarding-context";
import FinishProfile from "./FinishProfile";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";
import { useUser } from "@clerk/nextjs";
import { AdminMetadata } from "@/utils/user";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep } = useOnboardingContext();

  const metadata = user?.publicMetadata as any as AdminMetadata;
  const isCompleted = metadata.lastOnboardingStepCompleted >= 1;

  if (!user || !isLoaded) return;
  return (
    <>
      {currOnboardingStep.step === 1 && currOnboardingStep.isEditing ? (
        <FinishProfile />
      ) : isCompleted ? (
        <ProfileAlreadyCreated />
      ) : (
        <FinishProfile />
      )}
    </>
  );
}
