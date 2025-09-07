"use client";

import LessonWorkspace from "./components/LessonWorkspace";
import LessonSidebar from "./components/LessonSidebar";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChapters, getLessons } from "@/app/actions/onboarding";
import { Chapter, Lesson } from "@/types/course";
import ClientTitle from "@/components/ClientTitle";
import Room from "@/components/Room";
import { useLearningContext } from "@/contexts/learning-context";

export default function LessonPage() {
  const { lesson, setLesson } = useLearningContext();
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // TODO: Figure out how to fetch lesson without fetching entire course.
        // Idea 1: Update useContent to manage currChapter and currLesson to update when elements on dynamic pages are clicked.
        // Idea 2: When you click a lesson on the [courseId] page, it sets a "chapterId" context variable to that lesson's chapter so that you have the chapterId to individually fetch a lesson.
        // Idea 3: Make the link /[courseId]/[chapterId]/[lessonId] so that you have the chapterId to individually fetch a lesson.
        const lessonsArr: Lesson[] = [];
        const chaptersRes = await getChapters(courseId);
        if (chaptersRes.success) {
          const chapters = JSON.parse(chaptersRes.data) as Chapter[];
          const lessonsPromises = chapters.map((chapter) =>
            getLessons(chapter.courseId, chapter.id)
          );
          const lessonsResults = await Promise.all(lessonsPromises);
          for (const res of lessonsResults) {
            if (res.success) {
              const lessons = JSON.parse(res.data) as Lesson[];
              lessonsArr.push(...lessons);
            }
          }
          setLesson(lessonsArr.filter((lesson) => lesson.id === lessonId)[0]);
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <>
      <ClientTitle
        title={
          lesson
            ? `${t("platform-layout:lesson-number", {
                lessonId: lesson.number,
              })}: ${lesson.name}`
            : "Loading lesson..."
        }
      />
      <Room>
        <div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden bg-dodger-blue-50 dark:bg-emerald-950 h-full">
          <LessonSidebar lesson={lesson} />

          {/* Dashboard */}
          <div className="flex flex-col h-full w-full justify-between grow gap-5 md:rounded-tl-2xl md:border-l border-default-color bg-[#fff] dark:bg-[#121212]">
            {/* Workspace */}
            <LessonWorkspace lesson={lesson} />
          </div>
        </div>
      </Room>
    </>
  );
}
