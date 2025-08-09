"use client";

import { Button } from "@/components/ui/button";
import { StyledButton } from "@/components/StyledButtons";
import { ChangeEvent, useRef, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaRedo,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { FaEraser, FaPencil, FaTrashCan } from "react-icons/fa6";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLearningContext } from "@/contexts/learning-context";
import { Lesson } from "@/types/course";

export default function LessonCanvas({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: Lesson | undefined;
}) {
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
              label: t("platform-layout:lesson-number", { lessonId: lesson.prevLessonId }),
              href: `/courses/${courseId}/lesson-${lesson.prevLessonId}`,
            }
          : null;
    }
    if (!result.next) {
      result.next =
        lesson.nextLessonId && lesson.nextLessonId !== ""
          ? {
              label: t("platform-layout:lesson-number", { lessonId: lesson.nextLessonId }),
              href: `/courses/${courseId}/lesson-${lesson.nextLessonId}`,
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
  const { activityId, setActivityId } = useLearningContext();
  const [showCanvasTools, setShowCanvasTools] = useState<boolean>(true);
  const { t } = useTranslation();

  const colorInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [eraseMode, setEraseMode] = useState(false);

  type Link = { label: string; href: string };
  const sidebarLinks: Link[] = [
    {
      // label: "Prereq Check",
      label: t("platform-layout:intro"),
      href: "#intro",
    },
    {
      label: t("platform-layout:lecture"),
      href: "#lecture",
    },
    {
      label: t("platform-layout:activity-1"),
      href: "#activity-1",
    },
    {
      label: t("platform-layout:checkpoint"),
      href: "#checkpoint",
    },
    {
      label: t("platform-layout:activity-2"),
      href: "#activity-2",
    },
    {
      label: t("platform-layout:practice"),
      href: "#practice",
    },
    {
      label: t("platform-layout:quiz"),
      href: "#quiz",
    },
    {
      label: t("platform-layout:wrapping-up"),
      href: "#wrapping-up",
    },
  ];

  const { prev, next } = getActivity();

  function handleStrokeColorChange(event: ChangeEvent<HTMLInputElement>) {
    setStrokeColor(event.target.value);
    console.log(strokeColor);
  }

  function handleEraserClick() {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }

  function handlePenClick() {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  }

  function handleUndoClick() {
    canvasRef.current?.undo();
  }

  function handleRedoClick() {
    canvasRef.current?.redo();
  }

  function handleClearClick() {
    canvasRef.current?.clearCanvas();
  }

  async function handleSave() {
    const dataURL = await canvasRef.current?.exportImage("png");
    if (dataURL) {
      const link = Object.assign(document.createElement("a"), {
        href: dataURL,
        style: { display: "none" },
        download: "sketch.png",
      });

      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  return (
    <div className="size-full relative">
      <ReactSketchCanvas
        width="100%"
        height="100%"
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor="transparent"
        className="!rounded-xl !cursor-crosshair !border-0 !border-default-color"
      />
      {/* Menu and Buttons */}
      <div
        className={`w-full h-20 flex justify-between ${
          showCanvasTools ? "items-center" : "items-end"
        } absolute left-1/2 bottom-0 -translate-x-1/2`}
      >
        {/* Previous Button */}
        <div className="size-full flex justify-start items-center ml-5">
          {prev && (
            <Link
              href={prev.href}
              className="flex justify-center items-center gap-2"
            >
              <StyledButton
                onClick={() => {
                  if (getActivityIndex(prev.href) !== -1) {
                    setActivityId(prev.href);
                  }
                }}
              >
                <ArrowLeft />
                {`${t("platform-layout:previous")}: ${prev.label}`}
              </StyledButton>
            </Link>
          )}
        </div>

        {/* Menu */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            className={`w-12 h-4 bg-primary-foreground rounded-t-md rounded-b-none ${
              showCanvasTools ? "border-t border-x" : "border"
            } border-default-color`}
            onClick={() => setShowCanvasTools((prev) => !prev)}
          >
            <span className="sr-only">
              {showCanvasTools ? "Hide tools" : "Show tools"}
            </span>
            {showCanvasTools ? <FaChevronDown /> : <FaChevronUp />}
          </Button>

          <div
            className={`expandable-content ${
              showCanvasTools ? "h-16" : "h-0 border-y-0"
            } flex grow items-center gap-5 px-5 bg-primary-foreground border border-default-color rounded-t-xl overflow-hidden`}
          >
            {/* Color Picker */}
            <Button
              size="icon"
              type="button"
              onClick={() => colorInputRef.current?.click()}
              style={{ backgroundColor: strokeColor }}
            >
              <input
                type="color"
                ref={colorInputRef}
                className="sr-only"
                value={strokeColor}
                onChange={handleStrokeColorChange}
              />
            </Button>

            {/* Pen */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              disabled={!eraseMode}
              onClick={handlePenClick}
            >
              <FaPencil />
            </StyledButton>

            {/* Eraser */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              disabled={eraseMode}
              onClick={handleEraserClick}
            >
              <FaEraser />
            </StyledButton>

            {/* Undo */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              onClick={handleUndoClick}
            >
              <FaUndo />
            </StyledButton>

            {/* Redo */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              onClick={handleRedoClick}
            >
              <FaRedo />
            </StyledButton>

            {/* Clear */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              onClick={handleClearClick}
            >
              <FaTrashCan />
            </StyledButton>

            {/* Save */}
            <StyledButton
              size="icon"
              type="button"
              variant="outline"
              onClick={handleSave}
            >
              <FaSave />
            </StyledButton>
          </div>
        </div>

        {/* Next Button */}
        <div className="size-full flex justify-end items-center mr-6">
          {next && (
            <Link
              href={next.href}
              className="flex justify-center items-center gap-2"
            >
              <StyledButton
                onClick={() => {
                  if (getActivityIndex(next.href) !== -1) {
                    setActivityId(next.href);
                  }
                }}
              >
                {`${t("platform-layout:next")}: ${next.label}`}
                <ArrowRight />
              </StyledButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
