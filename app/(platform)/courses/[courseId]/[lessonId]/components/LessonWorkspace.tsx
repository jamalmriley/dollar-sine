"use client";

import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LessonWorkspace({
  children,
  lesson,
}: {
  children: React.ReactNode;
  lesson: Lesson | undefined;
}) {
  const { activityId, setActivityId } = useLearningContext();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const hash = window.location.hash || "#intro"; // TODO: Make hash based on where the user left off.
    router.push(pathname + hash);
    setActivityId(hash);
  }, []);

  return (
    <div className="size-full relative">
      {/* Content */}
      <div
        className="size-full absolute top-0 left-0 p-5 border border-default-color rounded-xl flex flex-col justify-between dark:bg-grid-white/[0.1] bg-grid-black/[0.1]"
        id={activityId}
      >
        {lesson && (
          <span className="h2">
            {t(`platform-layout:${activityId.substring(1)}`)}
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="size-full absolute top-0 left-0">{children}</div>
    </div>
  );
}
