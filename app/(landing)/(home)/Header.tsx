"use client";

import Underline from "@/assets/images/needle-underline.png";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FadeInComponent from "@/components/FadeInComponent";
import TextDrop from "@/components/TextDrop";

export function Header() {
  return (
    <div className="size-full flex flex-col-reverse md:flex-row gap-10">
      {/* Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-5">
        <FadeInComponent direction="down">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-snug mb-1">
            <span className="bg-emerald-400 p-2 rounded-xl">Money</span> math
            that <br className="block md:hidden" />
            <span className="ml-2 md:ml-0">makes </span>
            <span className="inline-flex flex-col w-[68.38px] md:w-[85.78px] lg:w-[135.84px]">
              sense
              <Image
                src={Underline}
                alt="underline"
                className="unselectable -mt-[4px] md:-mt-[5px] lg:-mt-[9px] w-full scale-110" // A negative top margin is needed due to the leading-snug class.
              />
            </span>
          </h1>
        </FadeInComponent>

        <TextDrop
          text="Fun, interactive consumer math and science courses for students in
            grades 6-12."
          className="text-xl text-muted-foreground font-light"
        />
      </div>

      {/* Image */}
      <FadeInComponent
        direction="left"
        className="w-full md:w-1/2 h-full justify-center items-center"
      >
        <DotLottieReact
          src="https://lottie.host/d5d21f0f-2324-4c8a-a9dc-340941661f4a/VYwtweZbkr.lottie"
          loop
          autoplay
          className="size-full"
        />
      </FadeInComponent>
    </div>
  );
}
