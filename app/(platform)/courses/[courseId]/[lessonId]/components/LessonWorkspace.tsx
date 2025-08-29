"use client";

import {
  StyledActionButton,
  StyledDestructiveButton,
  StyledIconActionButton,
} from "@/components/StyledButtons";
import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LessonVideo from "./LessonVideo";
import "tldraw/tldraw.css";
import { useUser } from "@clerk/nextjs";
import LessonWhiteboard from "./LessonWhiteboard";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaChevronUp } from "react-icons/fa";
import { GiRunningShoe } from "react-icons/gi";
import {
  LuClipboardCheck,
  LuGamepad2,
  LuHeadphones,
  LuPencilRuler,
} from "react-icons/lu";
import { MdOutlineQuiz } from "react-icons/md";
import { PiFlagCheckeredFill } from "react-icons/pi";
import { TbZoomCheck } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [items, setItems] = useState(["whiteboard", "video"]);
  const [activeId, setActiveId] = useState<string | null>(null);

  type Link = { label: string; href: string; icon?: JSX.Element };
  const sidebarLinks: Link[] = [
    {
      // label: "Prereq Check",
      label: t("platform-layout:intro"),
      href: "#intro",
      icon: <LuClipboardCheck className="sidebar-item" />,
    },
    {
      label: t("platform-layout:lecture"),
      href: "#lecture",
      icon: <LuHeadphones className="sidebar-item" />,
    },
    {
      label: t("platform-layout:activity-1"),
      href: "#activity-1",
      icon: <LuPencilRuler className="sidebar-item" />,
    },
    {
      label: t("platform-layout:checkpoint"),
      href: "#checkpoint",
      icon: <TbZoomCheck className="sidebar-item" />,
    },
    {
      label: t("platform-layout:activity-2"),
      href: "#activity-2",
      icon: <LuGamepad2 className="sidebar-item" />,
    },
    {
      label: t("platform-layout:practice"),
      href: "#practice",
      icon: <GiRunningShoe className="sidebar-item" />,
    },
    {
      label: t("platform-layout:quiz"),
      href: "#quiz",
      icon: <MdOutlineQuiz className="sidebar-item" />,
    },
    {
      label: t("platform-layout:wrapping-up"),
      href: "#wrapping-up",
      icon: <PiFlagCheckeredFill className="sidebar-item" />,
    },
  ];

  function getActivity() {
    const result: {
      prev: Link | null;
      curr: Link | null;
      next: Link | null;
    } = { prev: null, curr: null, next: null };
    if (!lesson) return result;

    for (let i = 0; i < sidebarLinks.length; i++) {
      const [prev, curr, next] = [
        sidebarLinks[i - 1],
        sidebarLinks[i],
        sidebarLinks[i + 1],
      ];

      if (curr.href === activityId) {
        result.curr = curr;
        if (prev) result.prev = prev;
        if (next) result.next = next;
      }
    }

    if (!result.prev) {
      result.prev =
        lesson.prevLessonId && lesson.prevLessonId !== ""
          ? {
              label: t(
                `platform-layout:${lesson.prevLessonId.split("-")[0]}-number`,
                {
                  lessonId: lesson.prevLessonId.split("-")[1],
                }
              ),
              href: `/courses/${lesson.courseId}/${lesson.prevLessonId}`,
            }
          : null;
    }
    if (!result.next) {
      result.next =
        lesson.nextLessonId && lesson.nextLessonId !== ""
          ? {
              label: t(
                `platform-layout:${lesson.nextLessonId.split("-")[0]}-number`,
                {
                  lessonId: lesson.nextLessonId.split("-")[1],
                }
              ),
              href: `/courses/${lesson.courseId}/${lesson.nextLessonId}`,
            }
          : null;
    }

    return result;
  }

  function getActivityIndex(targetHref: string): number {
    for (let i = 0; i < sidebarLinks.length; i++) {
      const link = sidebarLinks[i];
      if (link.href === targetHref) return i;
    }
    return -1;
  }

  const { prev, next } = getActivity();

  useEffect(() => {
    const hash = window.location.hash || "#intro"; // TODO: Make hash based on where the user left off.
    router.push(pathname + hash);
    setActivityId(hash);
  }, []);

  if (!isLoaded || !user) return null;
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
            <span className="h2">
              {t(`platform-layout:${activityId.substring(1)}`)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Skeleton className="w-48 h-3 my-0.5" />
            <Skeleton className="w-24 h-6 lg:h-7 my-0.5" />
          </div>
        )}
      </>

      {/* Draggable Whiteboard and Video */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (over && active.id !== over.id) {
            setItems((items) => {
              const oldIndex = items.indexOf(active.id as string);
              const newIndex = items.indexOf(over.id as string);
              return arrayMove(items, oldIndex, newIndex);
            });
          }
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext
          items={items}
          strategy={
            isDesktop
              ? horizontalListSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <div className="size-full flex flex-col md:flex-row gap-5 md:gap-10">
            {items.map((id) => (
              <SortableItem
                widthType={id === "video" && isDesktop ? "fit" : "full"}
                key={id}
                id={id}
              >
                {id === "whiteboard" ? (
                  <LessonWhiteboard lesson={lesson} />
                ) : (
                  <LessonVideo />
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>

        <DragOverlay adjustScale={false}>
          {activeId ? (
            activeId === "whiteboard" ? (
              <div className="w-full h-full">
                <LessonWhiteboard lesson={lesson} />
              </div>
            ) : (
              <div className={`${isDesktop ? "w-fit" : "w-full"} h-full`}>
                <LessonVideo />
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Icon Buttons */}
      <span
        className={`w-full flex ${!prev && next ? "justify-end" : "justify-between"} gap-2`}
      >
        {!prev && !next && <Skeleton className="w-36 h-9" />}
        {!prev && !next && <Skeleton className="w-36 h-9" />}

        {prev && (
          <Link
            href={prev.href}
            className="flex justify-center items-center gap-2 md:hidden"
          >
            <StyledIconActionButton
              onClick={() => {
                if (getActivityIndex(prev.href) !== -1) {
                  setActivityId(prev.href);
                }
              }}
            >
              <ArrowLeft />
            </StyledIconActionButton>
          </Link>
        )}

        {prev && (
          <Link
            href={prev.href}
            className="hidden md:flex justify-center items-center gap-2"
          >
            <StyledActionButton
              onClick={() => {
                if (getActivityIndex(prev.href) !== -1) {
                  setActivityId(prev.href);
                }
              }}
            >
              <ArrowLeft />
              {`${t("platform-layout:previous")}: ${prev.label}`}
            </StyledActionButton>
          </Link>
        )}

        {next && (
          <Link
            href={next.href}
            className="flex justify-center items-center gap-2 md:hidden"
          >
            <StyledIconActionButton
              onClick={() => {
                if (getActivityIndex(next.href) !== -1) {
                  setActivityId(next.href);
                }
              }}
            >
              <ArrowRight />
            </StyledIconActionButton>
          </Link>
        )}

        {next && (
          <Link
            href={next.href}
            className="hidden md:flex justify-center items-center gap-2"
          >
            <StyledActionButton
              onClick={() => {
                if (getActivityIndex(next.href) !== -1) {
                  setActivityId(next.href);
                }
              }}
            >
              {`${t("platform-layout:next")}: ${next.label}`}
              <ArrowRight />
            </StyledActionButton>
          </Link>
        )}
      </span>

      {/* Mobile Drawer Menu */}
      {lesson && (
        <div className="md:hidden">
          <Drawer closeThreshold={0.5} direction="bottom">
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="absolute bottom-0 left-1/2 right-1/2 border-b-0 rounded-b-none shadow-none px-4"
              >
                <FaChevronUp />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-5 flex flex-col gap-4">
              <DrawerHeader className="flex justify-between items-center p-0">
                <span className="h2 line-clamp-1">
                  {t("platform-layout:lesson-number", {
                    lessonId: lesson.number,
                  })}
                  : {lesson.name}
                </span>
              </DrawerHeader>
              <Separator />

              <div className="grid grid-cols-2">
                {sidebarLinks.map((link, i) => (
                  <DrawerClose asChild key={i}>
                    <Link
                      href={link.href}
                      onClick={() => setActivityId(link.href)}
                      className="w-fit flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold hover:bg-accent hover:text-accent-foreground"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </DrawerClose>
                ))}
              </div>

              <DrawerFooter className="flex justify-between pt-2">
                <Link href={`/courses/${lesson.courseId}`}>
                  <StyledActionButton>Back to course</StyledActionButton>
                </Link>
                <DrawerClose asChild>
                  <StyledDestructiveButton>Close</StyledDestructiveButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

function SortableItem({
  id,
  widthType,
  children,
}: {
  id: string;
  widthType: "full" | "fit";
  children: React.ReactNode;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    opacity: isDragging ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-${widthType} h-full cursor-move`}
    >
      {children}
    </div>
  );
}
