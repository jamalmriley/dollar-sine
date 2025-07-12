import { getCourses } from "@/app/actions/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Course, SelectedCourse } from "@/types/course";
import { OrganizationMetadata, UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useCourseData(
  organization: Organization | undefined,
  userMetadata: UserMetadata | undefined
) {
  const {
    setCanPurchaseCourses,
    setCourses,
    setIsLoading,
    setPurchasedCourses,
  } = useOnboardingContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) return;
      await setIsLoading(true);
      try {
        // Returns whether or not the user is in the organization.
        const isInOrganization = (): boolean => {
          for (const orgMembership of user.organizationMemberships) {
            const org = orgMembership.organization;
            if (org.id === orgId) return true;
          }
          return false;
        };

        const courseRes = await getCourses();
        const courseData = JSON.parse(courseRes.data) as Course[];

        let orgId: string;
        let orgMetadata: OrganizationMetadata;
        let canPurchaseCourses: boolean;
        let purchasedCourses: SelectedCourse[] | null;

        if (organization) {
          orgId = organization.id;
          orgMetadata =
            organization.publicMetadata as unknown as OrganizationMetadata;

          // Returns whether or not the user can purchase courses.
          // The user is the owner of the org
          // or the user is in the org and isTeacherPurchasingEnabled is true,
          canPurchaseCourses =
            orgMetadata.ownerId === user.id ||
            (isInOrganization() && orgMetadata.isTeacherPurchasingEnabled);

          purchasedCourses = orgMetadata.courses;
        } else {
          // Returns whether or not the user can purchase courses.
          // The user is a guardian who chose not to join an org.
          canPurchaseCourses =
            userMetadata !== undefined &&
            userMetadata.role === "guardian" &&
            userMetadata.lastOnboardingStepCompleted >= 2;

          purchasedCourses = null;
        }

        await setCourses(courseData);
        await setCanPurchaseCourses(canPurchaseCourses);
        await setPurchasedCourses(purchasedCourses ?? undefined);
        await setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
        await setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [organization, userMetadata]);
}
