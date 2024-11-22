import { currentUser } from "@clerk/nextjs/server";
import CustomH1 from "@/components/CustomH1";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getStandard } from "@/data/standards";
import { promises as fs } from "fs";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import { LessonContent } from "./LessonContent";

export default async function ContentPage({ params }: { params: any }) {
  const [courseId, contentId] = [
    params.courseId, // (await params).courseId,
    params.contentId, // (await params).contentId,
  ];
  const file = await fs.readFile(
    process.cwd() + "/data/test-lesson-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const contentType = contentId.split("-")[0];

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
  // console.log(lesson);

  const user = await currentUser();
  const firstName = user?.firstName;
  const lastLetter = firstName?.charAt(firstName.length - 1);
  const endsWithS: boolean = lastLetter?.toLowerCase() === "s";

  return (
    <div className="h-full">
      <TooltipProvider>
        {/* Chapter Content */}
        {contentType === "chapter" && (
          <div className="page-container">
            <Breadcrumb className="mb-5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses">All Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses/common-cents">
                    Common Cents
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        Chapter {chapter.id}
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {course.chapters.map((chapter: any) => (
                          <DropdownMenuItem key={chapter.id}>
                            <BreadcrumbLink
                              href={`/courses/common-cents/chapter-${chapter.id}`}
                            >
                              Chapter {chapter.id}
                            </BreadcrumbLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* Title, Subtitle, and Button */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <CustomH1
                  text={`Chapter ${chapter.id}: ${chapter.title}`}
                  isPaddingEnabled={false}
                />
                <Button variant="outline" asChild className="rounded-lg h-10">
                  <Link href={`/courses/${courseId}`}>Back to chapters</Link>
                </Button>
              </div>
              <h2 className="subtitle">{chapter.description}</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Placeholder and Buttons */}
              <div className="w-full md:w-1/2 flex flex-col">
                <Skeleton className="aspect-[16/9] md:mr-10 mb-5 rounded-md" />
                <div className="flex gap-3 w-full justify-center md:justify-start">
                  <Button asChild variant="outline" className="p-5">
                    <Link href={`/courses/${courseId}/lesson-${chapter.id}.1`}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <FaPlay />
                          {/* TODO: Make it say "Start" or "Resume" depending on status. */}
                          <span>Resume Lesson {chapter.id}.1</span>
                        </div>

                        <Progress
                          value={Math.floor(Math.random() * 101)}
                          className="h-1"
                        />
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href={`/courses/${courseId}/chapter-${chapter.id}`}>
                      <div className="flex items-center gap-2">
                        <VscDebugRestart />
                        <span>Restart</span>
                      </div>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Lesson and Resource Lists */}
              <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="h2 mt-5 md:mt-0">Lessons 📚</h2>
                <Accordion type="single" collapsible className="mb-10">
                  {chapter.lessons.map((lesson: any) => (
                    <AccordionItem key={lesson.id} value={lesson.id}>
                      <AccordionTrigger className="">
                        <span className="flex gap-3 items-center">
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full"
                          >
                            <Link
                              href={`/courses/${courseId}/lesson-${lesson.id}`}
                            >
                              <FaPlay className="w-1 h-1" />
                            </Link>
                          </Button>
                          Lesson {lesson.id}: {lesson.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col items-center md:items-start">
                        <span className="mb-5">
                          {lesson.description}{" "}
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="underline">Hover here</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex gap-10 p-3">
                                {!!lesson.topics.consumer_math.length && (
                                  <div className="flex flex-col">
                                    <span className="font-bold mb-1 text-center">
                                      Consumer Math Skills
                                    </span>

                                    {lesson.topics.consumer_math.map(
                                      (topic: string, i: number) => (
                                        <span key={i}>
                                          {i + 1}. {topic}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}

                                {!!lesson.topics.financial_literacy.length && (
                                  <div className="flex flex-col">
                                    <span className="font-bold mb-1 text-center">
                                      Financial Literacy Skills
                                    </span>
                                    {lesson.topics.financial_literacy.map(
                                      (topic: string, i: number) => (
                                        <span key={i}>
                                          {i + 1}. {topic}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>{" "}
                          to view topics.
                        </span>
                        {/* Focus Standard(s) */}
                        <div className="w-full">
                          {!!lesson.currCCSS.length && (
                            <div className="flex flex-col gap-5 border border-dotted rounded-xl p-3">
                              <span className="font-bold text-sm">
                                Focus Standard
                                {lesson.currCCSS.length === 1 ? "" : "s"}
                              </span>
                              <div className="flex gap-3">
                                {lesson.currCCSS.map((standard: string) => (
                                  <Tooltip key={standard}>
                                    <TooltipTrigger>
                                      <span className="badge-2">
                                        {standard}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="flex flex-col max-w-80 p-3">
                                      <span className="font-bold mb-1">
                                        {standard}
                                      </span>
                                      <span className="text-xs">
                                        {getStandard(standard)}
                                      </span>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Student Tools */}
                <div>
                  <h2 className="h2">
                    {firstName}'{endsWithS ? "" : "s"} Tools 🛠️
                  </h2>

                  <div className="tools-container">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-28 rounded-md" />
                      <Skeleton className="w-28 h-5 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-28 rounded-md" />
                      <Skeleton className="w-28 h-5 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-28 rounded-md" />
                      <Skeleton className="w-28 h-5 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-28 rounded-md" />
                      <Skeleton className="w-28 h-5 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-28 rounded-md" />
                      <Skeleton className="w-28 h-5 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {contentType === "lesson" && (
          <LessonContent
            courseId={courseId}
            lessonPrefix={lessonPrefix}
            lessons={lessons}
            lesson={lesson}
          />
        )}
      </TooltipProvider>
    </div>
  );
}
