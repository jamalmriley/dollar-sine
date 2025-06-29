import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import FinishProfile from "./FinishProfile";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, userMetadata } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;
  const currStep = 1;

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;

  return (
    <>
      {!isCompleted || (step === 1 && isEditing) ? (
        <FinishProfile />
      ) : (
        <ProfileAlreadyCreated />
      )}
    </>
  );
}
