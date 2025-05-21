import { UserMetadata } from "@/types/user";
import CreateOrUpdateOrg from "./CreateOrUpdateOrg";
import OrgAlreadyCreated from "./OrgAlreadyCreated";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUser } from "@/app/actions/onboarding";
import { User } from "@clerk/nextjs/server";

export default function Organization() {
  const { user, isLoaded } = useUser();
  const { currOnboardingStep, lastUpdated } = useOnboardingContext();
  const { step, isEditing } = currOnboardingStep;

  const currStep = 2;
  const metadata = user?.publicMetadata as any as UserMetadata;
  const initIsCompleted = metadata.lastOnboardingStepCompleted >= currStep;
  const [isCompleted, setIsCompleted] = useState<boolean>(initIsCompleted);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
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
      {!isCompleted || (step === 2 && isEditing) ? (
        <CreateOrUpdateOrg />
      ) : (
        <OrgAlreadyCreated />
      )}
    </>
  );
}
