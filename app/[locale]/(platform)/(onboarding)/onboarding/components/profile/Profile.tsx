import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";

export default function Profile({
  component1,
  component2,
}: {
  component1: JSX.Element | undefined;
  component2: JSX.Element | undefined;
}) {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, userMetadata } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;
  const currStep = 1;

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;

  return (
    <>{!isCompleted || (step === 1 && isEditing) ? component1 : component2}</>
  );
}
