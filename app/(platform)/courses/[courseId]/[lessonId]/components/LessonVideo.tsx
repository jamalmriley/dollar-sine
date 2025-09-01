// import Video from "next-video";
// import TestVideo from "@/videos/test-video-1.mp4";
// import Sutro from "player.style/sutro/react";

import { FuzzyOverlay } from "@/components/FuzzyOverlay";
import { MdDragIndicator } from "react-icons/md";

export default function LessonVideo() {
  return (
    <div className="w-full md:w-fit h-fit md:h-full flex flex-col">
      <span className="w-full hidden md:flex items-center gap-2 py-1.5 px-2 rounded-t-xl bg-secondary border-t border-x border-default-color group">
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#ff5f57]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#febc2e]" />
        <div className="size-3 my-0.5 rounded-full bg-woodsmoke-300 dark:bg-woodsmoke-700 group-hover:bg-[#27c840]" />
        <MdDragIndicator className="ml-auto hidden group-hover:block" />
      </span>
      <span className="size-full flex justify-center items-center relative overflow-hidden border-b md:border border-default-color bg-woodsmoke-900 text-woodsmoke-50 md:rounded-b-xl aspect-video md:aspect-[9/16]">
        <FuzzyOverlay />
      </span>
    </div>
  );
}

/* <Video src={TestVideo} theme={Sutro} /> */
