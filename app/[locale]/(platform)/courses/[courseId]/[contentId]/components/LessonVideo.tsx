import Video from "next-video";
import TestVideo from "@/videos/test-video-1.mp4";
import Sutro from "player.style/sutro/react";

export default function LessonVideo() {
  return (
    <div className="w-full md:w-1/3 h-full min-w-[312.1875px] rounded-xl overflow-hidden border border-default-color">
      <Video src={TestVideo} theme={Sutro} />
    </div>
  );
}
