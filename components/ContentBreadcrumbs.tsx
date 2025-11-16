"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Course } from "@/types/course";

export function ClassroomBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            {t("platform-layout:dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/classroom" className="text-primary">
            {t("platform-layout:classroom")}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function CourseBreadcrumb({
  allCourses,
  course,
  isLoading,
}: {
  allCourses: Course[] | undefined;
  course: Course | undefined;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            {t("platform-layout:dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/classroom">
            {t("platform-layout:classroom")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {course ? (
            <BreadcrumbPage>
              {isLoading ? (
                <Skeleton className="w-24 h-4" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {course.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {allCourses &&
                      allCourses.map((course) => (
                        <DropdownMenuItem key={course.id}>
                          <BreadcrumbLink href={`/classroom/${course.id}`}>
                            {course.name}
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/dashboard" className="text-primary">
              Error
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/* export function LessonBreadcrumb({
  lesson,
  lessons,
}: {
  lesson: Lesson | undefined;
  lessons: Lesson[] | undefined;
}) {
  const { t } = useTranslation();
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            {t("platform-layout:dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/classroom">
            {t("platform-layout:classroom")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {lesson ? (
            <BreadcrumbLink href={`/classroom/${lesson.courseId}`}>
              {lesson.courseName}
            </BreadcrumbLink>
          ) : (
            <Skeleton className="w-20 h-4 my-0.5" />
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {lesson && lessons ? (
            <BreadcrumbPage>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {t("platform-layout:lesson-number", {
                    lessonId: lesson.number,
                  })}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {lessons
                    .filter((lssn) => lssn.chapterId === lesson.chapterId)
                    .map((lesson) => (
                      <DropdownMenuItem key={lesson.id}>
                        <BreadcrumbLink href={lesson.pathname}>
                          {t("platform-layout:lesson-number", {
                            lessonId: lesson.number,
                          })}
                        </BreadcrumbLink>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbPage>
          ) : (
            <Skeleton className="w-20 h-4 my-0.5" />
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
} */
