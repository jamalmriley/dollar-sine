"use client";

import { Progress } from "@/components/ui/progress";
import Prompt1 from "./components/Prompt1";
import Prompt2 from "./components/Prompt2";
import Prompt3 from "./components/Prompt3";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminOnboardingPage() {
  const prompts = [<Prompt1 />, <Prompt2 />, <Prompt3 />];

  return (
    <div className="page-container flex justify-center items-center">
      <Carousel className="w-11/12 lg:w-[95%]">
        <CarouselContent>
          {prompts.map((prompt, index) => (
            <CarouselItem key={index}>
              <div className="size-full">{prompt}</div>
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
