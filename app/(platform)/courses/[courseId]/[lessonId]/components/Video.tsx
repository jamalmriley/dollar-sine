import { FuzzyOverlay } from "@/components/FuzzyOverlay";
import LessonComponentContainer from "./LessonComponentContainer";

export default function Video() {
  return (
    <LessonComponentContainer className="md:border-t relative aspect-video md:aspect-[9/16]">
      <FuzzyOverlay />
    </LessonComponentContainer>
  );
}

/* <Video src={TestVideo} theme={Sutro} /> */
// import Video from "next-video";
// import TestVideo from "@/videos/test-video-1.mp4";
// import Sutro from "player.style/sutro/react";
