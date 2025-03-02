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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getStandard } from "@/data/standards";
import { ChevronDown } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import StyledButton from "@/components/StyledButton";
import Link from "next/link";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";

const i18nNamespaces = ["platform-layout"];

export default async function ChapterContent({
  courseId,
  course,
  chapter,
  params: { locale },
}: {
  courseId: any;
  course: any;
  chapter: any;
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="page-container">
        {/* TODO: Make anything that says "Common Cents" dynamic based on selected course. */}
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* TODO: make it say "My Courses" if this is an enrolled course, or "All Courses" if it is not. */}
              <BreadcrumbLink href="/courses">
                {t("all-courses")}
              </BreadcrumbLink>
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
                    {t("chapter-number", { chapterId: chapter.id })}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {course.chapters.map((chapter: any) => (
                      <DropdownMenuItem key={chapter.id}>
                        <BreadcrumbLink
                          href={`/courses/common-cents/chapter-${chapter.id}`}
                        >
                          {t("chapter-number", { chapterId: chapter.id })}
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
              text={`${t("chapter-number", { chapterId: chapter.id })}: ${
                chapter.title
              }`}
              isPaddingEnabled={false}
            />
            <Link href={`/courses/${courseId}`}>
              <StyledButton>{t("back-to-chapters")}</StyledButton>
            </Link>
          </div>
          <h2 className="subtitle">{chapter.description}</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Placeholder and Buttons */}
          <div className="w-full md:w-1/2 flex flex-col">
            <Skeleton className="aspect-[16/9] md:mr-10 mb-5 rounded-md" />
            <div className="flex gap-5 w-full justify-center md:justify-start">
              {/* TODO: Make it say "Start" or "Resume" depending on status. */}

              <Link
                href={`/courses/${courseId}/lesson-${chapter.id}.1`}
                className="flex justify-center items-center gap-2"
              >
                <StyledButton>
                  <FaPlay />
                  {t("resume-lesson", { lessonId: `${chapter.id}.1` })}
                </StyledButton>
              </Link>

              <Link
                href={`/courses/${courseId}/chapter-${chapter.id}`}
                className="flex justify-center items-center gap-2"
              >
                <StyledButton>
                  <VscDebugRestart />
                  {t("restart")}
                </StyledButton>
              </Link>
            </div>
          </div>

          {/* Lesson and Resource Lists */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h2 className="h2 mt-5 md:mt-0">{t("lessons")} 📚</h2>
            <Accordion type="single" collapsible className="mb-10">
              {chapter.lessons.map((lesson: any) => (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger>
                    {/* TODO: Make sr-text say "Start" or "Resume" depending on status. */}
                    <span className="flex gap-4 items-center">
                      {/* <Link href={`/courses/${courseId}/lesson-${lesson.id}`}>
                      <StyledButton size="icon">
                        <FaPlay />
                        <span className="sr-only">
                          {`Start Lesson ${lesson.id}`}
                        </span>
                      </StyledButton>
                    </Link> */}
                      {t("lesson-number", { lessonId: lesson.id })}:{" "}
                      {lesson.title}
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
                    {/* TODO: Only display for teacher/admin accounts. */}
                    <div className="w-full">
                      {!!lesson.currCCSS.length && (
                        <div className="flex flex-col gap-5 border border-default-color border-dotted rounded-xl p-3">
                          <span className="font-bold text-sm">
                            Focus Standard
                            {lesson.currCCSS.length === 1 ? "" : "s"}
                          </span>
                          <div className="flex gap-3">
                            {lesson.currCCSS.map((standard: string) => (
                              <Tooltip key={standard}>
                                <TooltipTrigger>
                                  <span className="badge-2 hover:scale-110 relative transition duration-500">
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

            {/* My Tools */}
            <div>
              <h2 className="h2">{t("my-tools")} 🛠️</h2>

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
    </TranslationsProvider>
  );
}
