"use client";

import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import placeholder from "@/assets/images/placeholders/cc_placeholder.jpg";
import CustomH1 from "@/components/CustomH1";
import CourseTile from "@/components/CourseTile";
import { StyledButton } from "@/components/StyledButtons";
import { Course } from "@/types/course";
import { useLearningContext } from "@/contexts/learning-context";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import { CoursesBreadcrumb } from "@/components/ContentBreadcrumbs";

// export const metadata: Metadata = setTitle("All Courses");

export default function CoursesPage() {
  const { allCourses, isLoading } = useLearningContext(); // TODO:  Add enrolledCourses
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return;
  return (
    <div className="page-container">
      <CoursesBreadcrumb />

      {/* Title and Button */}
      <div className="flex justify-between items-start">
        <CustomH1 text={t("platform-layout:courses")} isPaddingEnabled />

        <Link href={`/dashboard`}>
          <StyledButton>{t("platform-layout:back-to-dashboard")}</StyledButton>
        </Link>
      </div>

      {isLoading ? (
        <>Loading courses...</>
      ) : !allCourses || allCourses.length === 0 ? (
        <>No courses available</>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allCourses.map((course: Course) => (
            <CourseTile key={course.id}>
              <Link href={course.pathname}>
                <Image
                  // src={course.imageUrl}
                  src={placeholder}
                  alt={course.name}
                  className="object-cover"
                />

                {/* Course Name, Info, and Progress */}
                <div className="absolute bottom-0 left-0 w-full">
                  {/* Course Name and Info */}
                  <div className="p-3 bg-gradient-to-t from-zinc-950">
                    <h2 className="text-lg text-white font-bold mb-1">
                      {course.name}
                    </h2>
                    <p className="text-xs text-white">{course.description}</p>
                  </div>

                  <Progress value={50} className="h-1.5 rounded-none" />
                </div>
              </Link>
            </CourseTile>
          ))}
        </div>
      )}
    </div>
  );
}
