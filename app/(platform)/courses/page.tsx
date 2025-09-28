"use client";

import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import CustomH1 from "@/components/CustomH1";
import { StyledButton } from "@/components/StyledButton";
import { Course } from "@/types/course";
import { useLearningContext } from "@/contexts/learning-context";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import { CoursesBreadcrumb } from "@/components/ContentBreadcrumbs";
import { FaPlay } from "react-icons/fa";
import { convertArrToRange } from "@/utils/general";
import { Skeleton } from "@/components/ui/skeleton";
import ClientTitle from "@/components/ClientTitle";
import { useMediaQuery } from "usehooks-ts";

export default function CoursesPage() {
  const { allCourses, isLoading } = useLearningContext(); // TODO:  Add enrolledCourses
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return;
  return (
    <div className="page-container">
      <ClientTitle title="Courses" />
      <CoursesBreadcrumb />

      {/* Title and Button */}
      <div className="flex justify-between items-center">
        <CustomH1 text={t("platform-layout:courses")} isPaddingEnabled />

        {isDesktop && (
          <Link href={`/dashboard`}>
            <StyledButton>
              {t("platform-layout:back-to-dashboard")}
            </StyledButton>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-5">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
        </div>
      ) : !allCourses || allCourses.length === 0 ? (
        <>No courses available</>
      ) : (
        <div className="flex gap-5">
          {allCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={course.pathname}>
      <div className="min-w-60 w-60 relative border border-default-color rounded-xl overflow-hidden group transition ease-in-out duration-500 hover:scale-105 hover:border-2">
        {/* Thumbnail */}
        <Image
          src={course.imageUrl}
          alt={course.name}
          className="w-full aspect-[10/16] bg-secondary"
        />

        {/* Play Icon */}
        <div className="size-9 flex justify-center items-center bg-emerald-400 rounded-full border border-default-color absolute inset-0 m-auto hover:animate-hover-tada opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
          <FaPlay className="text-white" />
        </div>

        {/* Label and Progress Bar */}
        <div className="w-full absolute bottom-0 z-10">
          <div className="w-full p-3 text-white">
            {/* TODO: Add course.logo of type string to Course interface */}
            {/* TODO: Replace course.name with course.logo */}
            <p className="text-lg font-bold">{course.name}</p>
            <p className="text-xs line-clamp-1">
              Grades {convertArrToRange(course.gradeLevels)} •{" "}
              {course.genres.join(", ")}
            </p>
          </div>
          <Progress value={50} className="h-2 rounded-none" />
        </div>

        {/* Gradient Overlay */}
        <div className="w-full h-1/2 absolute bottom-0 z-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>
    </Link>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="min-w-60 w-60 relative border border-default-color rounded-xl overflow-hidden group transition ease-in-out duration-500 hover:scale-105 hover:border-2">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-[10/16] bg-secondary" />

      {/* Label and Progress Bar */}
      <div className="w-full absolute bottom-0">
        <div className="w-full p-3">
          <Skeleton className="h-6 w-1/2 my-0.5" />
          <Skeleton className="h-3 w-3/4 my-0.5" />
        </div>
        <Progress value={0} className="h-2 rounded-none" />
      </div>
    </div>
  );
}
