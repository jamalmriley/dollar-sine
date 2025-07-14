import { getOrganizationById, getUser } from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Organization, User } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useUserData(lastUpdated: string) {
  const { setIsLoading, setOrg, setUserData, setUserMetadata } =
    useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch user
        const res = await getUser(user.id);
        const userData = JSON.parse(res.data) as User;
        const userMetadata = userData.publicMetadata as unknown as UserMetadata;
        setUserData(userData);
        setUserMetadata(userMetadata);

        // Fetch organization
        const orgId =
          userMetadata.organizations?.[0] ??
          userMetadata.invitations?.[0]?.organizationId;

        if (orgId) {
          const res = await getOrganizationById(orgId);
          const org = JSON.parse(res.data) as Organization;
          setOrg(org);
        } else {
          setOrg(undefined);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [
    lastUpdated,
    user?.id,
    setIsLoading,
    setOrg,
    setUserData,
    setUserMetadata,
  ]);
}
