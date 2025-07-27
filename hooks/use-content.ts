import {
  getCourses,
  getOrganizationById,
  getUser,
} from "@/app/actions/onboarding";
import { useLearningContext } from "@/contexts/learning-context";
import { Course } from "@/types/course";
import { OrganizationMetadata, UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Organization, User } from "@clerk/nextjs/server";
import { useEffect } from "react";

export function useContent() {
  const { setAllCourses, setEnrolledCourses, setIsLoading, setOrg } =
    useLearningContext();
  const { user } = useUser();

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        // Fetch user
        const res = await getUser(user.id);
        const userData = JSON.parse(res.data) as User;
        const userMetadata = userData.publicMetadata as unknown as UserMetadata;
        let purchasedCourses: string[] | undefined;

        // Fetch organization
        const orgId = userMetadata.organizations?.[0];
        if (orgId) {
          const res = await getOrganizationById(orgId);
          const org = JSON.parse(res.data) as Organization;
          const orgMetadata =
            org.publicMetadata as unknown as OrganizationMetadata;
          purchasedCourses = orgMetadata.courses?.map((course) => course.id);
          setOrg(org);
        } else {
          setOrg(undefined);
        }

        const courseRes = await getCourses();
        const allCourses = JSON.parse(courseRes.data) as Course[];
        const enrolledCourses = allCourses.filter((course) =>
          purchasedCourses?.includes(course.id)
        );
        setAllCourses(allCourses);
        setEnrolledCourses(enrolledCourses);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);
}
