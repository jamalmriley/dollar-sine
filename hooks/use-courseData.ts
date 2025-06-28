import { getCourses, getOrganizationById } from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Course } from "@/types/course";
import { OrganizationMetadata, UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useCourseData() {
  const {
    org,
    setCanPurchaseCourses,
    setCourses,
    setIsLoading,
    setPurchasedCourses,
  } = useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchCourseData = async () => {
      await setIsLoading(true);
      try {
        if (!user) return;
        const courseRes = await getCourses();
        const courseData = JSON.parse(courseRes.data) as Course[];

        await setCourses(courseData);

        const userPublicMetadata = user.publicMetadata as any as UserMetadata;
        const orgId = org
          ? org.id
          : userPublicMetadata.invitations &&
              userPublicMetadata.invitations.length > 0
            ? userPublicMetadata.invitations[0].organizationId
            : null;

        if (!orgId) return;
        const orgRes = await getOrganizationById(orgId);
        const organization = JSON.parse(orgRes.data) as Organization;
        const orgMetadata =
          organization.publicMetadata as any as OrganizationMetadata;

        const isOwner: boolean = Boolean(user.organizationMemberships[0]);
        const canPurchaseCourses: boolean =
          isOwner ||
          (orgMetadata.isTeacherPurchasingEnabled &&
            orgMetadata.invitations !== null &&
            orgMetadata.invitations.filter(
              (invitation) =>
                invitation.userId === user?.id &&
                invitation.status !== "Accepted"
            ).length === 0);

        await setCanPurchaseCourses(canPurchaseCourses);
        await setPurchasedCourses(orgMetadata.courses ?? undefined);
        await setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
        await setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [org]);
}
