import { AdminMetadata } from "@/types/user";
import CreateOrUpdateOrg from "./CreateOrUpdateOrg";
import OrgAlreadyCreated from "./OrgAlreadyCreated";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";

export default function Organization() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep } = useOnboardingContext();

  const metadata = user?.publicMetadata as any as AdminMetadata;
  const isCompleted = metadata.lastOnboardingStepCompleted >= 2;

  if (!user || !isLoaded) return;
  return (
    <>
      {currOnboardingStep.step === 2 && currOnboardingStep.isEditing ? (
        <CreateOrUpdateOrg />
      ) : isCompleted ? (
        <OrgAlreadyCreated />
      ) : (
        <CreateOrUpdateOrg />
      )}
    </>
  );
}
