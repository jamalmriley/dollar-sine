import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMediaQuery } from "usehooks-ts";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Course, SelectedCourse } from "@/types/course";
import {
  getCourses,
  getOrganizationById,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { PaymentWindow } from "./PaymentWindow";
import { CourseCard, CourseCardSkeleton } from "./CourseCard";
import NoCourses from "./NoCourses";
import { useUser } from "@clerk/nextjs";
import {
  OrganizationMetadata,
  TeacherMetadata,
  UserMetadata,
} from "@/types/user";
import { Organization } from "@clerk/nextjs/server";
import { StyledActionButton } from "@/components/StyledButtons";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Courses() {
  const {
    activeCourse,
    courses,
    setCourses,
    currOnboardingStep,
    isLoading,
    setIsLoading,
    lastUpdated,
    setLastUpdated,
    setIsOnboardingComplete,
  } = useOnboardingContext();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [hasViewed, setHasViewed] = useState<boolean>(false);
  const [canPurchaseCourses, setCanPurchaseCourses] = useState<boolean>(false);
  const [purchasedCourses, setPurchasedCourses] = useState<
    SelectedCourse[] | null
  >([]);
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const metadata = user?.publicMetadata as any as UserMetadata;
  const header = {
    title: canPurchaseCourses ? "Browse and add courses." : "Review courses.",
    description: canPurchaseCourses
      ? "Select the courses you want to buy for your organization."
      : "Below are the courses added to your organization.",
  };

  const isCoursePurchased = (targetId: string): boolean => {
    if (!purchasedCourses) return false;

    for (const course of purchasedCourses) {
      if (course.id === targetId) return true;
    }
    return false;
  };
  const findSelectedPlan = (targetId: string): string => {
    if (!purchasedCourses) return "";

    for (const course of purchasedCourses) {
      if (course.id === targetId && course.plan) return course.plan;
    }
    return "";
  };

  async function handleNonAdminCompleteOnboarding() {
    if (!user) return;
    const publicMetadata = user.publicMetadata as any as TeacherMetadata;
    const userMetadata: TeacherMetadata = {
      ...publicMetadata,
      onboardingLink: "/onboarding",
      isOnboardingComplete: true,
      lastOnboardingStepCompleted: 3,
    };

    await setIsLocalLoading(true);
    await updateUserMetadata(user.id, userMetadata).then(() => {
      setIsOnboardingComplete(true);
      setIsLocalLoading(false);
      setLastUpdated(new Date().toString());
      router.push("/onboarding-complete");
    });
  }

  useEffect(() => {
    const fetchAndSetCourses = async () => {
      setIsLoading(true);
      try {
        await getCourses()
          .then((res) => {
            const courseData = JSON.parse(res.data) as Course[];
            setCourses(courseData);
          })
          .then(() => {
            const id = metadata.invitations
              ? metadata.invitations[0].organizationId
              : null;

            if (!id) return;
            getOrganizationById(id).then((res) => {
              const organization = JSON.parse(res.data) as Organization;
              const orgMetadata =
                organization.publicMetadata as any as OrganizationMetadata;
              setPurchasedCourses(orgMetadata.courses);

              // Only allow purchasing if teacher purchasing is enabled and the user's invite is no longer pending.
              setCanPurchaseCourses(
                orgMetadata.isTeacherPurchasingEnabled &&
                  orgMetadata.invitations !== null &&
                  orgMetadata.invitations.filter(
                    (invitation) =>
                      invitation.userId === user?.id &&
                      invitation.status !== "Accepted"
                  ).length === 0
              );
              setIsLoading(false);
              setHasViewed(true);
            });
          });
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    if (currOnboardingStep.step === 3 && !hasViewed) fetchAndSetCourses();
  }, [currOnboardingStep.step, lastUpdated]);

  if (!user || !isLoaded) return;
  return (
    // <Card className="w-full h-fit max-w-2xl mx-10">
    <Card className="h-fit max-w-2xl mx-10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          {canPurchaseCourses && <PaymentWindow />}
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex justify-center gap-5 overflow-x-auto">
        {/* 
        If the courses have loaded and there is at least 1, display and array of CourseCard components.
        If the courses have loaded and there are none, display the NoCourses component.
        If the courses have not loaded yet, display an array of CourseCardSkeleton component.
         */}
        {!isLoading ? (
          courses.length ? (
            courses
              .filter((course) =>
                !canPurchaseCourses
                  ? isCoursePurchased(course.id)
                  : activeCourse
                    ? course.id === activeCourse.id
                    : course.id !== ""
              )
              .map((course, i) => (
                <CourseCard
                  key={i}
                  course={course}
                  canPurchaseCourses={canPurchaseCourses}
                  isAlreadyPurchased={
                    purchasedCourses !== null && isCoursePurchased(course.id)
                  }
                  selectedPlan={findSelectedPlan(course.id)}
                />
              ))
          ) : (
            <NoCourses />
          )
        ) : (
          <>
            {Array(isDesktop ? 2 : 1)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <CourseCardSkeleton />
                </div>
              ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex grow">
        <StyledActionButton
          className={`w-full ${
            isLocalLoading && "disabled:cursor-progress hover:bg-primary"
          }`}
          onClick={handleNonAdminCompleteOnboarding}
          disabled={isLocalLoading}
        >
          {isLocalLoading && <Loader2 className="animate-spin" />}
          Done
        </StyledActionButton>
      </CardFooter>
    </Card>
  );
}
