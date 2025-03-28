import { useOnboardingContext } from "@/contexts/onboarding-context";
import FinishProfile from "./FinishProfile";
import ProfileAlreadyCreated from "./ProfileAlreadyCreated";
import { useUser } from "@clerk/nextjs";
import { PublicMetadata } from "@/types/user";
import { useEffect, useState } from "react";
import { getUser } from "@/app/actions/onboarding";
import { User } from "@clerk/nextjs/server";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, lastUpdated } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;

  const currStep = 1;
  const metadata = user?.publicMetadata as any as PublicMetadata;
  const initIsCompleted = metadata.lastOnboardingStepCompleted >= currStep;
  const [isCompleted, setIsCompleted] = useState<boolean>(initIsCompleted);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as PublicMetadata;
        setIsCompleted(publicMetadata.lastOnboardingStepCompleted >= currStep);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isCompleted) fetchUser();
  }, [lastUpdated]);

  if (!user || !isLoaded) return;
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
