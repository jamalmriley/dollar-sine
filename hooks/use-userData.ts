import { getUser } from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useUserData(lastUpdated: string, isInitRender: boolean) {
  const { setIsLoading, setUserData, setUserMetadata } = useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      await setIsLoading(true);
      try {
        const res = await getUser(user.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata =
          userData.publicMetadata as unknown as UserMetadata;
        await setUserData(userData);
        await setUserMetadata(publicMetadata);
        if (!isInitRender) await setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        await setIsLoading(false);
      }
    };

    fetchUserData();
  }, [lastUpdated, user?.id, setUserData, setUserMetadata]);
}
