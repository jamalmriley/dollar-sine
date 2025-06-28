import {
  getOrganizationById,
  getOrganizationBySlug,
} from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useOrganizationData(
  orgIdentifierType: "id" | "slug",
  orgIdentifier: string | undefined,
  lastUpdated: string
) {
  const { setIsInitRender, setIsLoading, setOrg, setHasOrg } =
    useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      await setIsLoading(true);
      try {
        if (!user) return;
        const res =
          orgIdentifierType === "id"
            ? await getOrganizationById(orgIdentifier)
            : await getOrganizationBySlug(orgIdentifier);
        const org = JSON.parse(res.data) as Organization;
        await setOrg(org);
        await setHasOrg(true);
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
  }, [lastUpdated, setOrg]);
}
