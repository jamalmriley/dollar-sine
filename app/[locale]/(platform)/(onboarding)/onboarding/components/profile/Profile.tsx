import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import FinishProfile from "./FinishProfile";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, userMetadata } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const { role } = userMetadata;
  const currStep = role === "guardian" ? 2 : 1;
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;

  return (
    <>
      {!isCompleted || (step === currStep && isEditing) ? (
        <FinishProfile />
      ) : (
        <ProfileAlreadyCreated />
      )}
    </>
  );
}
