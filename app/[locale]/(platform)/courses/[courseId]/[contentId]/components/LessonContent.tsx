import { ChevronDown } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/skeleton";
import LessonSidebar from "./LessonSidebar";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import LessonWorkspace from "./LessonWorkspace";
import LessonCanvas from "./LessonCanvas";

const i18nNamespaces = ["platform-layout"];

export default async function LessonContent({
  courseId,
  lessonPrefix,
  lessons,
  lesson,
  params: { locale },
}: {
  courseId: any;
  lessonPrefix: any;
  lessons: any;
  lesson: any;
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden bg-givry-50 dark:bg-emerald-950 h-full">
        <LessonSidebar />

        {/* Dashboard */}
        <div className="flex flex-col h-full w-full justify-between grow p-10 gap-5 rounded-tl-2xl border-l border-default-color bg-[#fff] dark:bg-[#121212]">
          {/* Breadcrumb and Title */}
          <div className="flex flex-col">
            {/* TODO: Make anything that says "Common Cents" dynamic based on selected course. */}
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
                    {t("chapter-number", { chapterId: lessonPrefix })}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        {t("lesson-number", { lessonId: lesson.id })}
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {lessons.map((lesson: any) => (
                          <DropdownMenuItem key={lesson.id}>
                            <BreadcrumbLink
                              href={`/courses/common-cents/lesson-${lesson.id}`}
                            >
                              {t("lesson-number", { lessonId: lesson.id })}
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
                {t("lesson-number", { lessonId: lesson.id })}: {lesson.title}
              </h1>
              <Tooltip>
                <TooltipTrigger>
                  <HiOutlineInformationCircle className="w-6 h-6 text-dodger-blue-500" />
                </TooltipTrigger>
                <TooltipContent className="flex flex-col max-w-80 p-3">
                  <span className="font-bold mb-1">
                    What&apos;s this lesson about? 🤔
                  </span>
                  <span className="text-xs">{lesson.description}</span>
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
            <Skeleton className="w-full md:w-1/3 h-full min-w-[312.1875px]" />
          </div>
        </div>
      </div>
    </TranslationsProvider>
  );
}
