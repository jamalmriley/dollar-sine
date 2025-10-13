"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";
import { useState } from "react";
import { lessonContentLinks } from "./LessonContent";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import Image from "next/image";
import { motion } from "motion/react";

export default function LessonSidebar({
  lesson,
}: {
  lesson: Lesson | undefined;
}) {
  const { activityId, setActivityId } = useLearningContext();
  const [open, setOpen] = useState<boolean>(false);

  if (!lesson) return;

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-dodger-blue-50 dark:bg-primary-foreground">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <LessonIcon lesson={lesson} open={open} />
          <div className="mt-8 flex flex-col gap-2">
            {lessonContentLinks.map((link, i) => (
              <span
                key={i}
                className={`border rounded-full ${
                  link.label === activityId
                    ? "text-dodger-blue-800 border-dodger-blue-300 bg-dodger-blue-200"
                    : "border-transparent text-muted-foreground dark:text-dodger-blue-100"
                }`}
                onClick={() => setActivityId(link.label)}
              >
                <SidebarLink link={link} namespace="platform-layout" />
              </span>
            ))}
          </div>
        </div>
        <span className="text-primary">
          <SidebarLink
            link={{
              label: "Back to course",
              href: `/courses${lesson ? "/" + lesson.courseId : ""}`,
              icon: <TbArrowBigLeftFilled className="sidebar-item" />,
            }}
          />
        </span>
      </SidebarBody>
    </Sidebar>
  );
}

const LessonIcon = ({ lesson, open }: { lesson: Lesson; open: boolean }) => {
  const href = `/courses/${lesson.courseId}`;
  return (
    <a
      href={href}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm"
    >
      <div className="size-9 shrink-0 rounded-md border border-default-color overflow-hidden">
        <Image
          src={lesson.courseImageUrl}
          alt={lesson.courseName}
          width={36}
          height={36}
        />
      </div>
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-black dark:text-white"
        >
          <span className="line-clamp-1">{lesson.courseName}</span>
        </motion.span>
      )}
    </a>
  );
};
