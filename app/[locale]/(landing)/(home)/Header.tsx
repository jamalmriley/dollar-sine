"use client";

import Underline from "@/assets/images/needle-underline.png";
import Image from "next/image";

export function Header() {
  return (
    <div className="w-full p-10 flex flex-col justify-center items-center">
      <h1 className="h1 leading-snug mb-1">
        <span className="bg-emerald-400 p-2 rounded-xl">Money</span> math that
        makes{" "}
        <span className="inline-flex flex-col w-[68.38px] md:w-[85.78px] lg:w-[135.84px]">
          sense
          <Image
            src={Underline}
            alt="underline"
            className="-mt-[4px] md:-mt-[5px] lg:-mt-[9px] w-full scale-110" // A negative top margin is needed due to the leading-snug class.
          />
        </span>
        .
      </h1>
      <h3 className="h3">
        Fun, interactive consumer math and science courses for students in
        grades 6-12.
      </h3>
    </div>
  );
}