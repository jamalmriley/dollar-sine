"use client";

import Underline from "@/assets/images/needle-underline.png";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function Header() {
  return (
    <div className="w-full p-10 flex flex-col justify-center md:items-center">
      <h1 className="h1 font-extrabold leading-snug mb-1">
        <span className="bg-emerald-400 p-2 rounded-xl">Money</span> math that{" "}
        <br className="block md:hidden" />
        <span className="ml-2 md:ml-0">makes </span>
        <span className="inline-flex flex-col w-[68.38px] md:w-[85.78px] lg:w-[135.84px]">
          sense
          <Image
            src={Underline}
            alt="underline"
            className="unselectable -mt-[4px] md:-mt-[5px] lg:-mt-[9px] w-full scale-110" // A negative top margin is needed due to the leading-snug class.
          />
        </span>
        .
      </h1>
      <h3 className="h3">
        Fun, interactive consumer math and science courses for students in
        grades 6-12.
      </h3>

      <div className="w-full flex justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/d5d21f0f-2324-4c8a-a9dc-340941661f4a/VYwtweZbkr.lottie"
          loop
          autoplay
          className="size-60 md:size-80"
        />
      </div>
    </div>
  );
}
