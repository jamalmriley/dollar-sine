"use client";
import { lora } from "@/app/fonts";
import { WavyBackground } from "../ui/wavy-background";

export default function WavyBackgroundHero() {
  return (
    <WavyBackground
      backgroundFill="#000"
      colors={["#1e6239", "#2f754b", "#51906a", "#6eaf89", "#9bcdb0"]}
      className="max-w-4xl mx-auto"
    >
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center inline-block">
        dollar{" "}
      </p>

      <p
        className={`text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center inline-block ${lora.className}`}
      >
        sine
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Financial literacy and consumer math for junior high school students
      </p>

      <div className="flex flex-col md:flex-row justify-evenly gap-10">
        {/* 10 lessons */}
        <div className="flex flex-col text-center">
          <span className="text-7xl md:text-9xl font-extrabold">10</span>
          <span className="text-xl font-bold md:text-2xl">lessons</span>
        </div>

        {/* 10 financial literacy topics */}
        <div className="flex flex-col text-center">
          <span className="text-7xl md:text-9xl font-extrabold">10</span>
          <span className="text-xl font-bold md:text-2xl">financial literacy</span>
          <span className="text-xl font-bold md:text-2xl">topics</span>
        </div>

        {/* 10 consumer math topics */}
        <div className="flex flex-col text-center">
          <span className="text-7xl md:text-9xl font-extrabold">10</span>
          <span className="text-xl font-bold md:text-2xl">consumer math</span>
          <span className="text-xl font-bold md:text-2xl">topics</span>
        </div>
      </div>
    </WavyBackground>
  );
}
