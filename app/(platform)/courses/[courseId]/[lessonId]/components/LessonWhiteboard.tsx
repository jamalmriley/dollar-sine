"use client";

import { Lesson } from "@/types/course";
import { useUser } from "@clerk/nextjs";
import { MdDragIndicator } from "react-icons/md";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function LessonWhiteboard({
  lesson,
}: {
  lesson: Lesson | undefined;
}) {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) return;
  return (
    <div className="size-full flex flex-col">
      <span className="w-full flex items-center gap-2 py-1.5 px-2 rounded-t-xl bg-secondary border-t border-x border-default-color group">
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#ff5f57]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#febc2e]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#27c840]" />
        <MdDragIndicator className="ml-auto hidden group-hover:block" />
      </span>

      <Tldraw
        persistenceKey={
          user.id + (lesson ? lesson.courseId + "-" + lesson.id : "")
        }
        className="rounded-b-xl border border-default-color dark:bg-grid-white/[0.1] bg-grid-black/[0.1]"
      />
    </div>
  );
}
