import { Suspense } from "react";
import { promises as fs } from "fs";
import Loading from "@/app/[locale]/loading";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChapterContent from "./components/ChapterContent";
import LessonContent from "./components/LessonContent";
import TranslationsProvider from "@/components/ui/translations-provider";
import initTranslations from "@/app/i18n";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";
import LearningContextProvider from "@/contexts/learning-context";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = setTitle("Common Cents");
const i18nNamespaces = ["platform-layout", "common-cents"];

export default async function ContentPage({ params }: { params: any }) {
  const locale: string = params.locale;
  const user = await currentUser();

  if (!user)
    redirect(
      `/sign-in?redirect_url=/${locale}/courses/${params.courseId}/${params.contentId}`
    );

  const { resources } = await initTranslations(locale, i18nNamespaces);

  const [courseId, contentId] = [params.courseId, params.contentId];
  const contentType = contentId.split("-")[0];
  const file = await fs.readFile(
    process.cwd() + "/data/content-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const courses: any[] = data.courses;
  const course = courses.filter((course) => course.id === courseId)[0];
  const chapter = course.chapters.filter(
    (chapter: any) => `chapter-${chapter.id}` === contentId
  )[0];

  const lessonPrefix = parseInt(contentId.split("-")[1].split(".")[0]);
  const lessons = course.chapters[lessonPrefix - 1].lessons;
  const lesson = lessons.filter(
    (lesson: any) => `lesson-${lesson.id}` === contentId
  )[0];

  return (
    <LearningContextProvider>
      <div className="h-full">
        <Suspense fallback={<Loading />}>
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            <TooltipProvider>
              {/* Chapter Content */}
              {contentType === "chapter" && (
                <ChapterContent
                  courseId={courseId}
                  course={course}
                  chapter={chapter}
                  params={params}
                />
              )}

              {/* Lesson Content */}
              {contentType === "lesson" && (
                <LessonContent
                  courseId={courseId}
                  lessonPrefix={lessonPrefix}
                  lessons={lessons}
                  lesson={lesson}
                  params={params}
                />
              )}
            </TooltipProvider>
          </TranslationsProvider>
        </Suspense>
      </div>
    </LearningContextProvider>
  );
}
