"use client";

import { Lesson } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { FaPlay } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation();

  function formatDuration(minutes: number): string {
    const h: number = Math.floor(minutes / 60);
    const m: number = minutes - h * 60;

    const hr: string = h === 0 ? "" : h + "h";
    const min: string = m === 0 ? "" : m + "m";

    return [hr, min].filter((el) => el !== "").join(" ");
  }
  return (
    <div className="min-w-80 w-full h-fit border border-default-color rounded-xl overflow-hidden group transition ease-in-out duration-500 hover:scale-105 hover:border-2">
      {/* Thumbnail */}
      <div className="relative">
        <Image
          src={lesson.imageUrl}
          alt={lesson.name}
          className="w-full aspect-video bg-secondary"
        />

        {/* Play Icon */}
        <Link href={lesson.pathname}>
          <div className="size-9 flex justify-center items-center bg-emerald-400 rounded-full border border-default-color absolute inset-0 m-auto hover:animate-hover-tada opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
            <FaPlay className="text-white" />
          </div>
        </Link>

        {/* Progress Bar */}
        <Progress value={50} className="h-2 rounded-none absolute bottom-0" />
      </div>

      {/* Name, Description, Duration, and Button */}
      <div className="w-full flex flex-col text-sm px-3 py-1.5 bg-primary-foreground border-t border-default-color">
        <div className="flex justify-between items-center">
          <p className="font-bold line-clamp-1">
            {t(`platform-layout:${lesson.type.toLowerCase()}-number`, {
              lessonId:
                lesson.type === "Lesson"
                  ? lesson.number
                  : Math.floor(lesson.number),
            })}
            : {lesson.name}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={(e) => e.preventDefault()}
              >
                <BsThreeDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>More info</DropdownMenuItem>
              <DropdownMenuItem>Reset progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
          {lesson.description}
        </p>
        <p className="text-muted-foreground text-xs">
          ({formatDuration(lesson.duration)})
        </p>
      </div>
    </div>
  );
}
