"use client";

import Link from "next/link";
import CustomH1 from "@/components/CustomH1";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StyledButton } from "@/components/StyledButton";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import { useLearningContext } from "@/contexts/learning-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getChapters, getLessons } from "@/app/actions/onboarding";
import { Chapter, Course, Lesson, Standard } from "@/types/course";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatFirestoreDate } from "@/utils/general";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CourseBreadcrumb } from "@/components/ContentBreadcrumbs";
import { motion } from "framer-motion";
import ClientTitle from "@/components/ClientTitle";
import { useMediaQuery } from "usehooks-ts";
import { LessonCard } from "@/components/LessonCard";

type Tab = "Lessons" | "Extras" | "Details";

export default function CoursePage() {
  const { allCourses } = useLearningContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();
  const { user } = useUser();

  const [chapters, setChapters] = useState<Chapter[]>();
  const [lessons, setLessons] = useState<Lesson[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currTab, setCurrTab] = useState<Tab>("Lessons");

  const params = useParams();
  const courseId = params.courseId as string;
  const course = allCourses?.filter((course) => course.id === courseId)[0];
  const tabs: Tab[] = ["Lessons", "Details"];

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const lessonsArr: Lesson[] = [];
        await getChapters(courseId).then((res) => {
          if (res.success) {
            const chapters = JSON.parse(res.data) as Chapter[];
            for (const chapter of chapters) {
              getLessons(chapter.courseId, chapter.id).then((res) => {
                const lessons = JSON.parse(res.data) as Lesson[];
                lessonsArr.push(...lessons);
              });
            }
            setChapters(chapters);
            setLessons(lessonsArr);
          }
        });
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [courseId]);

  if (!user) return;
  return (
    <div className="page-container">
      <ClientTitle title={course?.name || "Loading course..."} />
      <CourseBreadcrumb
        allCourses={allCourses}
        course={course}
        isLoading={isLoading}
      />

      {/* Title, Subtitle, and Button */}
      <div className="flex justify-between items-center mb-5">
        {isLoading ? (
          <Skeleton className="w-96 h-12" />
        ) : (
          <CustomH1
            text={course?.name ?? "Error loading course"}
            isPaddingEnabled={false}
          />
        )}
        {isDesktop && (
          <StyledButton>
            <Link href="/courses">{t("platform-layout:back-to-courses")}</Link>
          </StyledButton>
        )}
      </div>

      {/* Tabs */}
      <CourseTabs tabs={tabs} currTab={currTab} setCurrTab={setCurrTab} />

      {/* Lessons */}
      {currTab === "Lessons" && (
        <LessonsComponent chapters={chapters} lessons={lessons} />
      )}

      {/* Details */}
      {currTab === "Details" && <DetailsComponent course={course} />}
    </div>
  );
}

function LessonCardSkeleton() {
  return (
    <div className="min-w-80 w-80 border border-default-color rounded-xl overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-video bg-secondary" />

      {/* Name, Description, Duration, and Button */}
      <div className="w-full flex flex-col text-sm px-3 py-1.5 bg-primary-foreground border-t border-default-color">
        <div className="flex justify-between items-center">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="size-7 rounded-full m-1" />
        </div>
        <Skeleton className="w-full h-3 mb-1" />
        <Skeleton className="w-5/6 h-3 mb-3" />
        <Skeleton className="w-8 h-3 mb-1" />
      </div>
    </div>
  );
}

function LessonsComponent({
  chapters,
  lessons,
}: {
  chapters: Chapter[] | undefined;
  lessons: Lesson[] | undefined;
}) {
  const [chapter, setChapter] = useState<Chapter>();

  if (!chapters || !lessons)
    return (
      <div className="w-full flex flex-col gap-5">
        {/* Chapter Text and Chapter Dropdown */}
        <div className="w-full flex flex-col-reverse gap-5 md:flex-row md:justify-between md:items-center">
          <Skeleton className="w-56 h-7" />
          <StyledButton disabled>Loading...</StyledButton>
        </div>

        {/* Lessons */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <LessonCardSkeleton key={i} />
            ))}
        </div>
      </div>
    );
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Chapter Text and Chapter Dropdown */}
      <div className="w-full flex flex-col-reverse gap-5 md:flex-row md:justify-between md:items-center">
        <span className="text-xl font-bold">
          Chapter {chapter?.number ?? chapters[0].number}:{" "}
          {chapter?.name ?? chapters[0].name}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <StyledButton buttonType="action">
              {chapter
                ? `Chapter ${chapter.number}`
                : `Chapter ${chapters[0].number}`}
            </StyledButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {chapters.map((chapter) => (
              <DropdownMenuItem
                key={chapter.id}
                onClick={() => setChapter(chapter)}
              >
                Chapter {chapter.number}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lessons Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {lessons
          .filter((lesson) =>
            chapter
              ? lesson.chapterId === chapter.id
              : lesson.chapterId === chapters[0].id
          )
          .map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
      </div>
    </div>
  );
}

function DetailsComponent({ course }: { course: Course | undefined }) {
  function getStandardsGroups(standards: Standard[]) {
    const result: number[] = [];

    for (const standard of standards) {
      if (!result.includes(standard.gradeLevel)) {
        result.push(standard.gradeLevel);
      }
    }

    return result;
  }
  if (!course)
    return (
      <div className="flex flex-col">
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold">Loading course details...</span>
          <StyledButton disabled>Report issue</StyledButton>
        </div>
        <Skeleton className="w-80 h-6 mb-5" />
        <div className="w-full flex flex-col md:flex-row gap-10 text-sm">
          {/* Release Date, Grade Level(s), and Topics */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            {/* Release Date and Grade Level(s) */}
            <div className="flex gap-5">
              <Skeleton className="w-44 h-5" />
              <Skeleton className="w-44 h-5" />
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-5">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className="w-full flex flex-col bg-primary-foreground rounded-md p-3 border border-default-color"
                  >
                    <Skeleton className="w-48 h-5 mb-2" />
                    <div className="-mx-1">
                      {Array(9)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton
                            key={i}
                            className="badge-2 w-40 h-[26px] rounded-full"
                          />
                        ))}
                    </div>
                  </span>
                ))}
            </div>
          </div>

          {/* Standards */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <Skeleton className="w-20 h-5" />
            <div className="bg-primary-foreground rounded-md px-3 border border-default-color">
              <Accordion type="single" collapsible className="w-full" disabled>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <AccordionItem key={i} value={`${i}`}>
                      <AccordionTrigger>
                        <Skeleton className="h-5 w-20" />
                      </AccordionTrigger>
                      <AccordionContent>Loading...</AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold">About this course</span>
          <StyledButton>Report issue</StyledButton>
        </div>
        <span className="mb-5">{course.description}</span>
        <div className="w-full flex flex-col md:flex-row gap-10 text-sm">
          {/* Release Date, Grade Level(s), and Topics */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            {/* Release Date and Grade Level(s) */}
            <div className="flex gap-5">
              {/* Release Date */}
              <span>
                <span className="font-bold">Release Date:</span>{" "}
                {format(
                  formatFirestoreDate(course.releaseDate),
                  "MMMM d, yyyy"
                )}
              </span>

              {/* Grade Level(s) */}
              <span>
                <span className="font-bold">
                  Grade Level{course.gradeLevels.length === 1 ? "" : "s"}:
                </span>{" "}
                {course.gradeLevels.map((grade) => `${grade}th`).join(", ")}
              </span>
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-5">
              {course.topics.map((topic) => (
                <span
                  key={topic.id}
                  className="w-full flex flex-col bg-primary-foreground rounded-md p-3 border border-default-color"
                >
                  <span className="font-semibold mb-2">
                    {topic.name} Topics
                  </span>
                  <div className="-mx-1">
                    {topic.subtopics.map((subtopic, i) => (
                      <span key={i} className="badge-2">
                        {subtopic}
                      </span>
                    ))}
                  </div>
                </span>
              ))}
            </div>
          </div>

          {/* Standards */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <span className="font-bold">Standards</span>
            <div className="bg-primary-foreground rounded-md px-3 border border-default-color">
              <Accordion type="single" collapsible className="w-full">
                {course.standards &&
                  getStandardsGroups(course.standards).map((gradeLevel) => (
                    <AccordionItem key={gradeLevel} value={`${gradeLevel}`}>
                      <AccordionTrigger>Grade {gradeLevel}</AccordionTrigger>
                      <AccordionContent className="-mx-1">
                        {course.standards &&
                          course.standards
                            .filter(
                              (standard) => standard.gradeLevel === gradeLevel
                            )
                            .map((standard) => (
                              <Tooltip key={standard.id}>
                                <TooltipTrigger asChild>
                                  <span className="badge-2">{standard.id}</span>
                                </TooltipTrigger>
                                <TooltipContent className="w-96">
                                  <p className="font-bold text-sm mb-1.5">
                                    {standard.name} ({standard.code})
                                  </p>
                                  <p>{standard.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function CourseTabs({
  tabs,
  currTab,
  setCurrTab,
}: {
  tabs: Tab[];
  currTab: Tab;
  setCurrTab: Dispatch<SetStateAction<Tab>>;
}) {
  return (
    <div className="flex flex-col gap-5 mb-5">
      <div className="flex gap-7">
        {tabs.map((tab) => {
          const isSelected = tab === currTab;
          return (
            <Link
              key={tab}
              href="#"
              className={`relative  text-sm leading-6 no-underline ${
                isSelected
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              } transform ease-out duration-500`}
              onClick={() => setCurrTab(tab)}
            >
              {tab}
              {isSelected ? (
                <motion.div className="absolute -bottom-[1px] left-0 right-0 h-[1px]">
                  <svg width="37" height="8" viewBox="0 0 37 8" fill="none">
                    <motion.path
                      d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
                      stroke="#16DB93"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{
                        strokeDasharray: 84.20591735839844,
                        strokeDashoffset: 84.20591735839844,
                      }}
                      animate={{
                        strokeDashoffset: 0,
                      }}
                      transition={{
                        duration: 1,
                      }}
                    />
                  </svg>
                </motion.div>
              ) : null}
            </Link>
          );
        })}
      </div>
      <Separator />
    </div>
  );
}
