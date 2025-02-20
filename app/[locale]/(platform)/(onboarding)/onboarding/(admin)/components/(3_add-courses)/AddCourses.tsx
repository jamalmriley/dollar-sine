import { CourseData } from "@/app/api/courses/route";
import { useEffect, useState } from "react";
import { PaymentWindow } from "./PaymentWindow";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCard, { CourseCardSkeleton } from "./CourseCard";
import NoCourses from "./NoCourses";
import { useMediaQuery } from "usehooks-ts";
import { useOnboardingContext } from "@/contexts/onboarding-context";

export default function AddCourses() {
  const header = {
    title: "Browse and add courses.",
    description: "Select the courses you want to add for your organization.",
  };

  const { isLoading, setIsLoading, lastRetrievedCourses } =
    useOnboardingContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const getCourses = async (): Promise<any> => {
    const courses = await fetch("/api/courses", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        return json;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });

    return courses;
  };

  useEffect(() => {
    const fetchAndSetCourses = async () => {
      setIsLoading(true);
      try {
        const courses = await getCourses();
        const data: CourseData[] = courses.data;
        setCourses(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetCourses();
  }, [lastRetrievedCourses]);

  return (
    <Card className="w-full h-full max-w-3xl mx-10">
      <CardHeader>
        <CardTitle className="h2">{header.title}</CardTitle>
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
          courses.length > 0 ? (
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
            <NoCourses />
            // <CourseCardSkeleton />
          )
        ) : (
          <>
            {Array(isDesktop ? 3 : 1)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <CourseCardSkeleton />
                </div>
              ))}
          </>
        )}
      </CardContent>

      <CardFooter>
        <PaymentWindow />
      </CardFooter>
    </Card>
  );
}
