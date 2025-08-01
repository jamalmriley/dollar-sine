"use client";

import Image from "next/image";
import Link from "next/link";
import CustomH1 from "@/components/CustomH1";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { StyledButton, StyledDropdownButton } from "@/components/StyledButtons";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import { useLearningContext } from "@/contexts/learning-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Progress } from "@/components/ui/progress";
import { FaPlay } from "react-icons/fa";

export default function CoursePage() {
  type Tab = "Lessons" | "Extras" | "Details";

  const { allCourses } = useLearningContext();
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
  }, []);

  if (!user) return;
  return (
    <div className="page-container">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              {t("platform-layout:dashboard")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/courses">
              {t("platform-layout:courses")}
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
                      {allCourses.map((course) => (
                        <DropdownMenuItem key={course.id}>
                          <BreadcrumbLink href={`/courses/${course.id}`}>
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
        <StyledButton>
          <Link href="/courses">{t("platform-layout:back-to-courses")}</Link>
        </StyledButton>
      </div>

      {/* Tabs */}
      <div className="flex flex-col mb-5">
        <div className="flex text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-20 flex flex-col transform ease-out duration-500 ${tab === currTab ? "font-semibold" : "font-normal"}`}
              onClick={() => setCurrTab(tab)}
            >
              <span className="w-full pb-2 text-center">{tab}</span>
              <span
                className={`w-full h-1.5 ${tab === currTab ? "bg-emerald-400 border border-b-0 border-default-color" : "bg-transparent border border-b-0 border-transparent"}`}
              />
            </button>
          ))}
        </div>
        <Separator />
      </div>

      {/* Lessons */}
      {currTab === "Lessons" && (
        <LessonsComponent chapters={chapters} lessons={lessons} />
      )}

      {/* Details */}
      {currTab === "Details" && <DetailsComponent course={course} />}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation();

  function formatDuration(minutes: number): string {
    const h: number = Math.floor(minutes / 60);
    const m: number = minutes - h * 60;

    const hr: string = h === 0 ? "" : h + "h";
    const min: string = m === 0 ? "" : m + "m";

    return [hr, min].filter((el) => el !== "").join(" ");
  }
  return (
    <div className="min-w-80 w-80 flex flex-col gap-2.5">
      {/* Thumbnail, Play Icon, and Progress Bar */}
      <Link href={lesson.pathname}>
        <div className="w-full relative border border-default-color rounded-xl overflow-hidden group transition ease-in-out duration-500 hover:scale-105 hover:border-2">
          {/* Thumbnail */}
          <Image
            src={lesson.imageUrl}
            alt={lesson.name}
            className="w-full aspect-video bg-secondary"
          />

          {/* Play Icon */}
          <div className="size-9 flex justify-center items-center bg-emerald-400 rounded-full border border-default-color absolute inset-0 m-auto hover:animate-hover-tada opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
            <FaPlay className="text-white" />
          </div>

          {/* Progress Bar */}
          <Progress value={50} className="h-2 rounded-none absolute bottom-0" />
        </div>
      </Link>

      {/* Name, Description, Duration, and Button */}
      <div className="w-full flex flex-col text-sm px-3 py-1.5 bg-primary-foreground border border-default-color rounded-xl">
        <div className="flex justify-between items-center">
          <p className="font-bold">
            {t("platform-layout:lesson-number", { lessonId: lesson.id })}:{" "}
            {lesson.name}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={(e) => e.preventDefault()}
              >
                <BsThreeDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>More info</DropdownMenuItem>
              <DropdownMenuItem>Reset progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
          {lesson.description}
        </p>
        <p className="text-muted-foreground text-xs">
          ({formatDuration(lesson.duration)})
        </p>
      </div>
    </div>
  );
}

function LessonCardSkeleton() {
  return (
    <div className="min-w-80 w-80 flex flex-col gap-2.5">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-video bg-secondary border border-default-color rounded-xl" />

      {/* Name, Description, Duration, and Button */}
      <div className="w-full flex flex-col text-sm px-3 py-1.5 bg-primary-foreground border border-default-color rounded-xl">
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

// TODO: Expandable Lesson Card: https://ui.aceternity.com/components/expandable-card
/*
<span
className={`badge ${lesson.difficulty === "Beginner" ? "bg-emerald-200 text-emerald-700" : lesson.difficulty === "Intermediate" ? "bg-selective-yellow-200 text-selective-yellow-700" : lesson.difficulty === "Advanced" ? "bg-red-200 text-red-700" : "bg-red-700 text-red-200"}`}
>
  {lesson.difficulty}
</span>
*/

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
        <div className="w-full flex justify-between items-center">
          <Skeleton className="w-56 h-7" />
          <StyledDropdownButton disabled>Loading...</StyledDropdownButton>
        </div>

        {/* Lessons Carousel */}
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
      <div className="w-full flex justify-between items-center">
        <span className="text-xl font-bold">
          Chapter {chapter?.id ?? chapters[0].id}:{" "}
          {chapter?.name ?? chapters[0].name}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <StyledDropdownButton>
              {chapter ? `Chapter ${chapter.id}` : `Chapter ${chapters[0].id}`}
            </StyledDropdownButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {chapters.map((chapter) => (
              <DropdownMenuItem
                key={chapter.id}
                onClick={() => setChapter(chapter)}
              >
                Chapter {chapter.id}
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
            // <LessonCardSkeleton key={lesson.id} />
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
        <div className="w-full flex gap-10 text-sm">
          {/* Release Date, Grade Level(s), and Topics */}
          <div className="w-1/2 flex flex-col gap-5">
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
          <div className="w-1/2 flex flex-col gap-5">
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
        <div className="w-full flex gap-10 text-sm">
          {/* Release Date, Grade Level(s), and Topics */}
          <div className="w-1/2 flex flex-col gap-5">
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
          <div className="w-1/2 flex flex-col gap-5">
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
