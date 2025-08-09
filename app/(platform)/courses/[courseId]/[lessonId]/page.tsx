"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import LessonWorkspace from "./components/LessonWorkspace";
import LessonCanvas from "./components/LessonCanvas";
import LessonVideo from "./components/LessonVideo";
import LessonSidebar from "./components/LessonSidebar";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChapters, getLessons } from "@/app/actions/onboarding";
import { Chapter, Lesson } from "@/types/course";
import { LessonBreadcrumb } from "@/components/ContentBreadcrumbs";

export default function LessonPage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [, setIsLoading] = useState<boolean>(false);
  const [lesson, setLesson] = useState<Lesson>();
  const [lessons, setLessons] = useState<Lesson[]>();

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
          setLessons(lessonsArr);
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
    <TooltipProvider>
      <div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden bg-dodger-blue-50 dark:bg-emerald-950 h-full">
        <LessonSidebar />

        {/* Dashboard */}
        <div className="flex flex-col h-full w-full justify-between grow p-10 gap-5 rounded-tl-2xl border-l border-default-color bg-[#fff] dark:bg-[#121212]">
          {/* Breadcrumb and Title */}
          <div className="flex flex-col">
            <LessonBreadcrumb lesson={lesson} lessons={lessons} />

            {/* Title */}
            <div className="flex gap-3 items-center">
              <h1 className="lesson-h1">
                {t("platform-layout:lesson-number", {
                  lessonId: lesson?.number,
                })}
                : {lesson?.name}
              </h1>
              <Tooltip>
                <TooltipTrigger>
                  <HiOutlineInformationCircle className="w-6 h-6 text-dodger-blue-500" />
                </TooltipTrigger>
                <TooltipContent className="flex flex-col max-w-80 p-3">
                  <span className="font-bold mb-1">
                    What&apos;s this lesson about? 🤔
                  </span>
                  <span className="text-xs">{lesson?.description}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Workspace and Video */}
          <div className="flex flex-col-reverse md:flex-row grow gap-10">
            {/* Workspace */}
            <LessonWorkspace>
              <LessonCanvas courseId={courseId} lesson={lesson} />
            </LessonWorkspace>

            {/* Video */}
            <LessonVideo />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
