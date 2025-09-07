"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { lessonContentLinks } from "./LessonContent";

export default function LessonSidebar({
  lesson,
}: {
  lesson: Lesson | undefined;
}) {
  const { activityId, setActivityId } = useLearningContext();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-dodger-blue-50 dark:bg-emerald-950">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-8 flex flex-col gap-2">
            {lessonContentLinks.map((link, i) => (
              <span
                key={i}
                className={`${
                  link.label === activityId
                    ? "text-primary"
                    : "text-muted-foreground dark:text-emerald-100"
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
              icon: <ArrowLeft className="sidebar-item" />,
            }}
          />
        </span>
      </SidebarBody>
    </Sidebar>
  );
}
