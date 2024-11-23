"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  LuClipboardCheck,
  LuGamepad2,
  LuHeadphones,
  LuPencilRuler,
} from "react-icons/lu";
import { MdOutlineQuiz } from "react-icons/md";
import { GiRunningShoe } from "react-icons/gi";
import { TbZoomCheck } from "react-icons/tb";
import { PiFlagCheckeredFill } from "react-icons/pi";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { FaToolbox } from "react-icons/fa";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LessonContent({
  courseId,
  lessonPrefix,
  lessons,
  lesson,
}: {
  courseId: any;
  lessonPrefix: any;
  lessons: any;
  lesson: any;
}) {
  const links = [
    {
      label: "Prereq Check",
      href: "#",
      icon: <LuClipboardCheck className="sidebar-item" />,
    },
    {
      label: "Lecture",
      href: "#",
      icon: <LuHeadphones className="sidebar-item" />,
    },
    {
      label: "Activity #1",
      href: "#",
      icon: <LuPencilRuler className="sidebar-item" />,
    },
    {
      label: "Checkpoint",
      href: "#",
      icon: <TbZoomCheck className="sidebar-item" />,
    },
    {
      label: "Activity #2",
      href: "#",
      icon: <LuGamepad2 className="sidebar-item" />,
    },
    {
      label: "Practice",
      href: "#",
      icon: <GiRunningShoe className="sidebar-item" />,
    },
    {
      label: "Quiz",
      href: "#",
      icon: <MdOutlineQuiz className="sidebar-item" />,
    },
    {
      label: "Wrap-Up",
      href: "#",
      icon: <PiFlagCheckeredFill className="sidebar-item" />,
    },
  ];
  const [open, setOpen] = useState<boolean>(false);
  const [currStep, setCurrStep] = useState<number>(0);
  return (
    <div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden bg-gray-100 dark:bg-neutral-800 h-full">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, i) => (
                <span
                  key={i}
                  className={`${
                    i === currStep
                      ? "text-primary"
                      : "text-neutral-700 dark:text-neutral-200"
                  }`}
                  onClick={() => setCurrStep(i)}
                >
                  <SidebarLink link={link} />
                </span>
              ))}
            </div>
          </div>

          <SidebarLink
            link={{
              label: "My Tools",
              href: "#",
              icon: <FaToolbox className="sidebar-item" />,
            }}
          />
        </SidebarBody>
      </Sidebar>

      {/* Dashboard */}
      <div className="flex flex-col h-full w-full justify-between grow p-10 gap-5 rounded-tl-2xl border-l bg-[#fff] dark:bg-[#121212]">
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

        {/* Interactive Area and Video */}
        <div className="flex flex-col-reverse md:flex-row grow gap-10">
          {/* Interactive Area */}
          <div className="w-full h-full p-5 border rounded-md flex flex-col justify-between">
            <span className="h2">{links[currStep].label}</span>
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

          {/* Video */}
          <Skeleton className="w-full md:w-1/3 h-full min-w-[312.1875px]" />
        </div>
      </div>
    </div>
  );
}
