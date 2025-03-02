"use client";

import StyledButton from "@/components/StyledButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function LessonWorkspace({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: any;
}) {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full p-5 border border-default-color rounded-md flex flex-col justify-between dark:bg-grid-white/[0.1] bg-grid-black/[0.1]">
      {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" /> */}
      <span className="h2">
        TODO: Create useLessonContext to allow for multiple client components to
        access lesson's content state. And make prev/next buttons go from
        activity to activity instead of lesson to lesson unless the prev/next
        thing is a lesson. And make activities go to #activity but make it an
        accessible param. And turn this into a canvas!
      </span>
      {/* Buttons */}
      <div
        className={`flex items-center ${
          lesson.prevLesson === ""
            ? "justify-end"
            : lesson.nextLesson === ""
            ? "justify-start"
            : "justify-between"
        }`}
      >
        {lesson.prevLesson != "" && (
          <Link
            href={`/courses/${courseId}/lesson-${lesson.prevLesson}`}
            className="flex justify-center items-center gap-2"
          >
            <StyledButton>
              <ArrowLeft />
              {t("previous-lesson", { lessonId: lesson.prevLesson })}
            </StyledButton>
          </Link>
        )}
        {lesson.nextLesson !== "" && (
          <Link
            href={`/courses/${courseId}/lesson-${lesson.nextLesson}`}
            className="flex justify-center items-center gap-2"
          >
            <StyledButton>
              {t("next-lesson", { lessonId: lesson.nextLesson })}
              <ArrowRight />
            </StyledButton>
          </Link>
        )}
      </div>
    </div>
  );
}
