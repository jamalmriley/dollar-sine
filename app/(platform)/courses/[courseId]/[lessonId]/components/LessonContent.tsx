"use client";

import "tldraw/tldraw.css";
import { Links } from "@/components/ui/sidebar";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  LuClipboardCheck,
  LuGamepad2,
  LuHeadphones,
  LuPencilRuler,
} from "react-icons/lu";
import { MdOutlineQuiz } from "react-icons/md";
import { PiBarbell, PiFlagCheckeredFill } from "react-icons/pi";
import { TbZoomCheck } from "react-icons/tb";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import Whiteboard from "./Whiteboard";
import { CSS } from "@dnd-kit/utilities";
import { useLearningContext } from "@/contexts/learning-context";
import PracticeProblem from "./PracticeProblem";
import Video from "./Video";

function isFit(id: string) {
  const ids = ["practice", "video"];
  return ids.includes(id);
}

export const lessonContentLinks: Links[] = [
  {
    // label: "prereq-check",
    href: "#intro",
    icon: <LuClipboardCheck className="sidebar-item" />,
    label: "intro",
  },
  {
    href: "#lecture",
    icon: <LuHeadphones className="sidebar-item" />,
    label: "lecture",
  },
  {
    href: "#activity-1",
    icon: <LuPencilRuler className="sidebar-item" />,
    label: "activity-1",
  },
  {
    href: "#checkpoint",
    icon: <TbZoomCheck className="sidebar-item" />,
    label: "checkpoint",
  },
  {
    href: "#activity-2",
    icon: <LuGamepad2 className="sidebar-item" />,
    label: "activity-2",
  },
  {
    href: "#practice",
    icon: <PiBarbell className="sidebar-item" />,
    label: "practice",
  },
  {
    href: "#quiz",
    icon: <MdOutlineQuiz className="sidebar-item" />,
    label: "quiz",
  },
  {
    href: "#wrapping-up",
    icon: <PiFlagCheckeredFill className="sidebar-item" />,
    label: "wrapping-up",
  },
];

export function LessonIntroduction() {
  return <div>The Introduction</div>;
}

export function LessonLecture() {
  const { lesson } = useLearningContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [items, setItems] = useState(["whiteboard", "video"]);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (isDesktop) {
    return (
      <>
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
                  widthType={isFit(id) && isDesktop ? "fit" : "full"}
                  key={id}
                  id={id}
                >
                  {id === "whiteboard" ? (
                    <Whiteboard lesson={lesson} />
                  ) : (
                    <Video />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={false}>
            {activeId ? (
              activeId === "whiteboard" ? (
                <div className="w-full h-full">
                  <Whiteboard lesson={lesson} />
                </div>
              ) : (
                <div className={`${isDesktop ? "w-fit" : "w-full"} h-full`}>
                  <Video />
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </>
    );
  } else
    return (
      <div className="size-full flex flex-col">
        <Video />
        <Whiteboard lesson={lesson} />
      </div>
    );
}

export function LessonActivity1() {
  return <div>The First Activity</div>;
}

export function LessonCheckpoint() {
  return <div>The Checkpoint</div>;
}

export function LessonActivity2() {
  return <div>The Second Activity</div>;
}

export function LessonPractice() {
  const { lesson } = useLearningContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [items, setItems] = useState(["practice", "whiteboard"]);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (isDesktop) {
    return (
      <>
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
                  widthType={isFit(id) && isDesktop ? "fit" : "full"}
                  key={id}
                  id={id}
                >
                  {id === "whiteboard" ? (
                    <Whiteboard lesson={lesson} />
                  ) : (
                    <PracticeProblem />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={false}>
            {activeId ? (
              activeId === "whiteboard" ? (
                <div className="w-full h-full">
                  <Whiteboard lesson={lesson} />
                </div>
              ) : (
                <div className={`${isDesktop ? "w-fit" : "w-full"} h-full`}>
                  <PracticeProblem />
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </>
    );
  } else
    return (
      <div className="size-full flex flex-col">
        <PracticeProblem />
        <Whiteboard lesson={lesson} />
      </div>
    );
}

export function LessonQuiz() {
  return <div>The Quiz</div>;
}

export function LessonWrapUp() {
  return <div>The Wrap-up</div>;
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
