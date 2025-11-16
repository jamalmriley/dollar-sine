"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Lesson } from "@/types/course";
import { useUser } from "@clerk/nextjs";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Whiteboard({ lesson }: { lesson: Lesson | undefined }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) return;
  if (lesson)
    return (
      <Tldraw
        persistenceKey={`${user.id}-${lesson.courseId}`}
        components={{
          Background: () => <div className="size-full bg-primary-foreground" />,
        }}
      />
    );
  return <Skeleton className="size-full bg-secondary" />;
}
