import { useEffect, useState } from "react";
import { PaymentWindow } from "./PaymentWindow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseCard, CourseCardSkeleton } from "./CourseCard";
import NoCourses from "./NoCourses";
import { useMediaQuery } from "usehooks-ts";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Course } from "@/types/course";
import { getCourses } from "@/app/actions/onboarding";

export default function AddCourses() {
  const header = {
    title: "Browse and add courses.",
    description: "Select the courses you want to add for your organization.",
  };

  const {
    activeCourse,
    courses,
    setCourses,
    isLoading,
    setIsLoading,
    currOnboardingStep,
    lastUpdated,
  } = useOnboardingContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [hasViewed, setHasViewed] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndSetCourses = async () => {
      setIsLoading(true);
      try {
        const res = await getCourses();
        const courseData = JSON.parse(res.data) as Course[];
        setCourses(courseData);
        setIsLoading(false);
        setHasViewed(true);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    if (currOnboardingStep.step === 3 && !hasViewed) fetchAndSetCourses();
  }, [currOnboardingStep.step, lastUpdated]);

  return (
    <Card className="w-full h-full max-w-3xl mx-10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          <PaymentWindow />
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex justify-center gap-5 mb-5 overflow-x-auto">
        {/* 
        If the courses have loaded and there is at least 1, display and array of CourseCard components.
        If the courses have loaded and there are none, display the NoCourses component.
        If the courses have not loaded yet, display an array of CourseCardSkeleton component.
         */}
        {!isLoading ? (
          courses.length ? (
            !activeCourse ? (
              courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  pricing={course.pricing}
                  imageUrl={course.imageUrl}
                />
              ))
            ) : (
              courses
                .filter((course) => course.id === activeCourse.id)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    pricing={course.pricing}
                    imageUrl={course.imageUrl}
                  />
                ))
            )
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
    </Card>
  );
}
