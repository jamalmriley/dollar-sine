"use client";

import { StyledButton } from "@/components/StyledButton";
import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "tldraw/tldraw.css";
import { useUser } from "@clerk/nextjs";
import { useMediaQuery } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LessonActivity1,
  LessonActivity2,
  LessonCheckpoint,
  lessonContentLinks,
  LessonIntroduction,
  LessonLecture,
  LessonPractice,
  LessonQuiz,
  LessonWrapUp,
} from "./LessonContent";
import { Links } from "@/components/ui/sidebar";

const activities: Map<string, () => JSX.Element> = new Map([
  ["", () => <>loading component...</>],
  ["intro", () => <LessonIntroduction />],
  ["lecture", () => <LessonLecture />],
  ["activity-1", () => <LessonActivity1 />],
  ["checkpoint", () => <LessonCheckpoint />],
  ["activity-2", () => <LessonActivity2 />],
  ["practice", () => <LessonPractice />],
  ["quiz", () => <LessonQuiz />],
  ["wrapping-up", () => <LessonWrapUp />],
]);

export default function LessonWorkspace({
  lesson,
}: {
  lesson: Lesson | undefined;
}) {
  const { activityId, setActivityId } = useLearningContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoaded, user } = useUser();

  const Activity = activities.get(activityId);

  function getActivity() {
    const result: {
      prev: Links | null;
      curr: Links | null;
      next: Links | null;
    } = { prev: null, curr: null, next: null };
    if (!lesson) return result;

    for (let i = 0; i < lessonContentLinks.length; i++) {
      const [prev, curr, next] = [
        lessonContentLinks[i - 1],
        lessonContentLinks[i],
        lessonContentLinks[i + 1],
      ];

      if (curr.label === activityId) {
        result.curr = curr;
        if (prev) result.prev = prev;
        if (next) result.next = next;
      }
    }

    if (!result.prev) {
      result.prev =
        lesson.prevLessonId && lesson.prevLessonId !== ""
          ? {
              href: `/classroom/${lesson.courseId}/${lesson.prevLessonId}`,
              icon: <></>,
              label: t(`platform-layout:${lesson.prevLessonType === "Lesson" ? "lesson" : "lab"}-number`, {
                lessonId: lesson.prevLessonId.split("-")[1],
              }),
            }
          : null;
    }
    if (!result.next) {
      result.next =
        lesson.nextLessonId && lesson.nextLessonId !== ""
          ? {
              href: `/classroom/${lesson.courseId}/${lesson.nextLessonId}`,
              icon: <></>,
              label: t(
                `platform-layout:${lesson.nextLessonType === "Lesson" ? "lesson" : "lab"}-number`,
                {
                  lessonId: lesson.nextLessonId.split("-")[1],
                }
              ),
            }
          : null;
    }

    return result;
  }

  function getActivityIndex(targetHref: string): number {
    for (let i = 0; i < lessonContentLinks.length; i++) {
      const link = lessonContentLinks[i];
      if (link.href === targetHref) return i;
    }
    return -1;
  }

  const { prev, next } = getActivity();

  useEffect(() => {
    const hash = window.location.hash || "#intro"; // TODO: Make hash based on where the user left off.
    router.push(pathname + hash);
    setActivityId(hash.substring(1));
  }, []);

  if (!isLoaded || !user) return null;
  if (isDesktop)
    return (
      <div className="size-full flex flex-col gap-5 p-10">
        {/* Label */}
        <>
          {lesson ? (
            <div className="flex flex-col gap-1">
              <h1 className="text-xs text-muted-foreground">
                {t("platform-layout:lesson-number", {
                  lessonId: lesson.number,
                })}
                : {lesson.name}
              </h1>
              <span className="h2">{t(`platform-layout:${activityId}`)}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Skeleton className="w-48 h-3 my-0.5" />
              <Skeleton className="w-24 h-6 lg:h-7 my-0.5" />
            </div>
          )}
        </>

        {Activity && (
          <div className="size-full">
            <Activity />
          </div>
        )}

        {/* Icon Buttons */}
        <span
          className={`w-full flex ${!prev && next ? "justify-end" : "justify-between"} gap-2`}
        >
          {!prev && !next && (
            <Skeleton className="w-9 md:w-36 h-9 md:rounded-full" />
          )}
          {!prev && !next && (
            <Skeleton className="w-9 md:w-36 h-9 md:rounded-full" />
          )}

          {prev && (
            <Link
              href={prev.href}
              className="flex justify-center items-center gap-2 md:hidden"
            >
              <StyledButton
                buttonType="action"
                isIconButton={true}
                onClick={() => {
                  if (getActivityIndex(prev.href) !== -1) {
                    setActivityId(prev.label);
                  }
                }}
              >
                <ArrowLeft />
              </StyledButton>
            </Link>
          )}

          {prev && (
            <Link
              href={prev.href}
              className="hidden md:flex justify-center items-center gap-2"
            >
              <StyledButton
                buttonType="action"
                onClick={() => {
                  if (getActivityIndex(prev.href) !== -1) {
                    setActivityId(prev.label);
                  }
                }}
              >
                <ArrowLeft />
                {`${t("platform-layout:previous")}: ${getActivityIndex(prev.href) !== -1 ? t(`platform-layout:${prev.label}`) : prev.label}`}
              </StyledButton>
            </Link>
          )}

          {next && (
            <Link
              href={next.href}
              className="flex justify-center items-center gap-2 md:hidden"
            >
              <StyledButton
                buttonType="action"
                isIconButton={true}
                onClick={() => {
                  if (getActivityIndex(next.href) !== -1) {
                    setActivityId(next.label);
                  }
                }}
              >
                <ArrowRight />
              </StyledButton>
            </Link>
          )}

          {next && (
            <Link
              href={next.href}
              className="hidden md:flex justify-center items-center gap-2"
            >
              <StyledButton
                buttonType="action"
                onClick={() => {
                  if (getActivityIndex(next.href) !== -1) {
                    setActivityId(next.label);
                  }
                }}
              >
                {`${t("platform-layout:next")}: ${getActivityIndex(next.href) !== -1 ? t(`platform-layout:${next.label}`) : next.label}`}
                <ArrowRight />
              </StyledButton>
            </Link>
          )}
        </span>
      </div>
    );
  else
    return (
      <>
        {Activity && (
          <div className="size-full">
            <Activity />
          </div>
        )}
      </>
    );
}
