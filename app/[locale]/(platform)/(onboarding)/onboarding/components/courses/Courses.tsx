import { useState } from "react";
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
import { updateUserMetadata } from "@/app/actions/onboarding";
import { PaymentWindow } from "./PaymentWindow";
import { CourseCard, CourseCardSkeleton } from "./CourseCard";
import NoCourses from "./NoCourses";
import { useUser } from "@clerk/nextjs";
import { TeacherMetadata } from "@/types/user";
import { StyledActionButton } from "@/components/StyledButtons";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCourseData } from "@/hooks/use-courseData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Courses() {
  const {
    activeCourse,
    canPurchaseCourses,
    courses,
    isLoading,
    purchasedCourses,
    setLastUpdated,
    setIsOnboardingComplete,
  } = useOnboardingContext();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);
  const header = {
    title: canPurchaseCourses ? "Browse and add courses." : "Review courses.",
    description: canPurchaseCourses
      ? "Select the courses you want to buy for your organization."
      : "Below are the courses added to your organization.",
  };

  function isCoursePurchased(targetId: string): boolean {
    if (!purchasedCourses) return false;

    for (const course of purchasedCourses) {
      if (course.id === targetId) return true;
    }
    return false;
  }
  function findSelectedPlan(targetId: string): string {
    if (!purchasedCourses) return "";

    for (const course of purchasedCourses) {
      if (course.id === targetId && course.plan) return course.plan;
    }
    return "";
  }
  async function handleNonPurchaseCompleteOnboarding() {
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
      setLastUpdated(new Date().toString()); // Triggers re-render.
      router.push("/onboarding-complete");
    });
  }

  useCourseData();
  if (!user || !isLoaded) return;

  return (
    // <Card className="w-full h-fit max-w-2xl mx-10">
    <Card className="h-fit max-w-2xl mx-10">
      <CardHeader>
        <div className="flex justify-between items-center">
          {isLoading ? (
            <Skeleton className="w-1/2 h-5 lg:h-6" />
          ) : (
            <CardTitle className="h2">{header.title}</CardTitle>
          )}
          {canPurchaseCourses && <PaymentWindow />}
        </div>
        {header.description !== "" &&
          (isLoading ? (
            <Skeleton className="w-5/6 h-4 md:h-5 mb-5" />
          ) : (
            <CardDescription className="subtitle">
              {header.description}
            </CardDescription>
          ))}
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
      {!isLoading && !canPurchaseCourses && (
        <CardFooter className="flex grow">
          <StyledActionButton
            className={`w-full ${
              isLocalLoading && "disabled:cursor-progress hover:bg-primary"
            }`}
            onClick={handleNonPurchaseCompleteOnboarding}
            disabled={isLocalLoading}
          >
            {isLocalLoading && <Loader2 className="animate-spin" />}
            Done
          </StyledActionButton>
        </CardFooter>
      )}
    </Card>
  );
}
