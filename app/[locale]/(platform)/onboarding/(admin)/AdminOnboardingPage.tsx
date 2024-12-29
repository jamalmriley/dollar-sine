"use client";

import { Progress } from "@/components/ui/progress";
import Prompt1 from "./components/Prompt1";
import Prompt3 from "./components/Prompt3";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AddColleagues from "./components/(prompt-2)/AddColleagues";
import AddStudents from "./components/(prompt-2)/AddStudents";
import AddGuardians from "./components/(prompt-2)/AddGuardians";

export default function AdminOnboardingPage() {
  const prompts = [
    { content: <Prompt1 />, basis: "basis-full" },
    { content: <AddColleagues />, basis: "basis-1/3" },
    { content: <AddStudents />, basis: "basis-1/3" },
    { content: <AddGuardians />, basis: "basis-1/3" },
    { content: <Prompt3 />, basis: "basis-full" },
  ];

  return (
    <div className="page-container flex justify-center items-center">
      <Carousel className="w-11/12 lg:w-[95%]">
        <CarouselContent>
          {prompts.map((prompt, index) => (
            <CarouselItem key={index} className={prompt.basis}>
              {prompt.content}
            </CarouselItem>
          ))}
          {/* 
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))} */}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
