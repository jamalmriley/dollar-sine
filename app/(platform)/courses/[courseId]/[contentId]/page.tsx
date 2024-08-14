import { auth } from "@/auth";
import CustomH1 from "@/components/CustomH1";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
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
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { Separator } from "@/components/ui/separator";

export default async function ContentPage({ params }: { params: any }) {
  const [courseId, contentId] = [params.courseId, params.contentId];
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

  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];
  const lastLetter = firstName?.split("").reverse()[0];
  const endsWithS: boolean = lastLetter?.toLowerCase() === "s";
  const lessonList: string[] = [
    "Prereq Check",
    "Lecture",
    "Activity #1",
    "Checkpoint",
    "Activity #2",
    "Practice",
    "Quiz",
    "Wrap-Up",
  ];

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

            <div className="flex justify-between items-start">
              {/* Placeholder and Buttons */}
              <div className="w-1/2">
                <Skeleton className="aspect-[16/9] mr-10 mb-5 rounded-md" />
                <div className="flex gap-3">
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
              <div className="w-1/2">
                <h2 className="h2">Lessons 📚</h2>
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
                              <FaPlay className="w-3 h-3" />
                            </Link>
                          </Button>
                          Lesson {lesson.id}: {lesson.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col items-start">
                        <span className="mb-5">{lesson.description}</span>
                        {!!lesson.currCCSS.length && (
                          <div className="flex gap-2 my-2 items-center">
                            <span className="font-bold">
                              Focus Standard
                              {lesson.currCCSS.length === 1 ? "" : "s"}:
                            </span>
                            {lesson.currCCSS.map((standard: string) => (
                              <Tooltip key={standard}>
                                <TooltipTrigger>
                                  <span className="badge-2">{standard}</span>
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
                        )}

                        <Tooltip>
                          <TooltipTrigger>
                            <span className="hover:underline">
                              Hover to view topics
                            </span>
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
                        </Tooltip>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <h2 className="h2">
                  {firstName}'{endsWithS ? "" : "s"} Tools 🛠️
                </h2>

                <div className="flex gap-5">
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
        )}

        {/* Lesson Content */}
        {contentType === "lesson" && (
          <div className="flex h-full">
            {/* Left Side */}
            <div className="flex flex-col w-60">
              <div className="p-5">
                <p className="text-center text-xl font-bold">50% complete</p>
                <Progress value={50} className="h-2 mt-2" />
              </div>
              <Separator decorative />
              <div className="flex flex-col justify-between h-full">
                <div className="px-5 pt-5">
                  {lessonList.map((el: string, i: number) => (
                    <div
                      key={i}
                      className="w-full h-10 flex justify-between items-center"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="w-4 text-sm text-right font-extrabold">
                          {i + 1}.
                        </span>
                        <span className="text-sm">{el}</span>
                      </div>
                      <div className="flex flex-col h-full items-center">
                        <div
                          className={`w-[1px] h-4 bg-[#27272a] ${
                            i === 0 ? "opacity-0" : ""
                          }`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full ${
                            i === 3 ? "bg-primary" : "bg-[#27272a]"
                          } `}
                        />
                        <div
                          className={`w-[1px] h-4 bg-[#27272a] ${
                            i === lessonList.length - 1 ? "opacity-0" : ""
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Separator decorative />
                  <div className="px-5 py-3 flex justify-between">
                    My Tools
                    <ChevronUp />
                  </div>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-full" />

            {/* Right Side */}
            <div className="flex flex-col justify-between grow p-10">
              {/* Breadcrumb and Title */}
              <div className="flex flex-col">
                <Breadcrumb className="mb-5">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/courses/common-cents">
                        Common Cents
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/courses/common-cents/chapter-${lessonPrefix}`}
                      >
                        Chapter {lessonPrefix}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1">
                            Lesson {lesson.id}
                            <ChevronDown className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {lessons.map((lesson: any) => (
                              <DropdownMenuItem key={lesson.id}>
                                <BreadcrumbLink
                                  href={`/courses/common-cents/lesson-${lesson.id}`}
                                >
                                  Lesson {lesson.id}
                                </BreadcrumbLink>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                {/* Title */}
                <div className="flex gap-3 items-center">
                  <h1 className="lesson-h1">
                    Lesson {lesson.id}: {lesson.title}
                  </h1>
                  <Tooltip>
                    <TooltipTrigger>
                      <HiOutlineInformationCircle className="w-6 h-6 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col max-w-80 p-3">
                      <span className="font-bold mb-1">
                        What's this lesson about? 🤔
                      </span>
                      <span className="text-xs">{lesson.description}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Content */}
              <Skeleton className="w-full h-full my-5" />

              {/* Buttons */}
              <div
                className={`flex ${
                  lesson.prevLesson === ""
                    ? "justify-end"
                    : lesson.nextLesson === ""
                    ? "justify-start"
                    : "justify-between"
                }`}
              >
                {lesson.prevLesson != "" && (
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-lg h-10 gap-2"
                  >
                    <Link
                      href={`/courses/${courseId}/lesson-${lesson.prevLesson}`}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Previous: Lesson {lesson.prevLesson}
                    </Link>
                  </Button>
                )}
                {lesson.nextLesson !== "" && (
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-lg h-10 gap-2"
                  >
                    <Link
                      href={`/courses/${courseId}/lesson-${lesson.nextLesson}`}
                    >
                      Next: Lesson {lesson.nextLesson}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
