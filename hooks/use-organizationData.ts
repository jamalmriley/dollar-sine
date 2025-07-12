import { getOrganizationById } from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useOrganizationData(
  lastUpdated: string,
  userMetadata: UserMetadata | undefined
) {
  const { setIsInitRender, setIsLoading, setOrg } = useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user) return;
      await setIsLoading(true);
      try {

        const orgId = userMetadata
          ? userMetadata.organizations
            ? userMetadata.organizations[0]
            : userMetadata.invitations
              ? userMetadata.invitations[0].organizationId
              : undefined
          : undefined;

        if (!orgId) {
          await setIsLoading(false);
          return;
        }

        const res = await getOrganizationById(orgId);
        const org = JSON.parse(res.data) as Organization;
        await setOrg(org);
        await setIsInitRender(false);
        await setIsLoading(false);
        return { org };
      } catch (error) {
        console.error("Failed to fetch organization data:", error);
        await setIsLoading(false);
        return {};
      }
    };

    fetchOrganizationData();
  }, [lastUpdated, userMetadata]);
}
