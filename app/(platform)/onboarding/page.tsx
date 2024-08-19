"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Prompt1 from "@/assets/svg/undraw_family_vg76.svg";
import Prompt2 from "@/assets/svg/undraw_children_re_c37f.svg";
import Prompt3 from "@/assets/svg/undraw_passing_by_0un9.svg";
import Prompt4 from "@/assets/svg/undraw_true_friends_c-94-g.svg";
import Prompt5 from "@/assets/svg/undraw_biking_kc-4-f.svg";
import Prompt6 from "@/assets/svg/undraw_favourite_item_pcyo.svg";
import Prompt7 from "@/assets/svg/undraw_special_event_-4-aj8.svg";
import Prompt8 from "@/assets/svg/undraw_savings_re_eq4w.svg";
import Image from "next/image";

export default function OnboardingPage() {
  const [currPrompt, setCurrPrompt] = useState<number>(0);
  const prompts: {
    prompt: string;
    description: string;
    image: string;
  }[] = [
    {
      prompt: "Who do you mainly live with at home?",
      description:
        "If you live in more than one home, choose the relative you live with more.",
      image: Prompt1,
    },
    {
      prompt: "Do you have any siblings?",
      description: "",
      image: Prompt2,
    },
    {
      prompt: "Do you have any pets?",
      description: "",
      image: Prompt3,
    },
    {
      prompt: "How do you mainly get to school?",
      description:
        "If you have more than one way of getting to school, choose the way you get to school more often.",
      image: Prompt4,
    },
    {
      prompt: "What are some of your interests?",
      description: "Select all that apply.",
      image: Prompt5,
    },
    {
      prompt: "What are some things you like to spend money on?",
      description: "Select all that apply.",
      image: Prompt6,
    },
    {
      prompt: "How many days per week do you order food or go out to eat?",
      description: "",
      image: Prompt7,
    },
    {
      prompt: "Is there anything that you're saving up for?",
      description: "",
      image: Prompt8,
    },
    // {
    //   prompt: "",
    //   description: "",
    //   image: "",
    // },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="page-container">
        <h1 className="h1 mb-10">Let's get to know you a bit.</h1>

        <div className="flex justify-between gap-10">
          {/* Prompt */}
          <div className="w-1/2">
            <h2 className="h2">{prompts[currPrompt].prompt}</h2>
            <span className="subtitle">{prompts[currPrompt].description}</span>
          </div>

          {/* Picture */}
          <div className="w-1/2">
            <Image
              src={prompts[currPrompt].image}
              alt={""}
              className="object-contain mx-auto h-96"
            />
          </div>
        </div>
      </div>

      {/* Buttons, Indicators, and Progress Bar*/}
      <div className="flex flex-col gap-10 items-center">
        <div className="flex gap-5 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrPrompt(Math.max(currPrompt - 1, 0))}
          >
            <FaArrowLeft />
          </Button>
          {prompts.map((prompt: any, i: number) => (
            <div
              key={i}
              onClick={() => setCurrPrompt(i)}
              className={`transform ease-out duration-500 ${
                i === currPrompt ? "w-5 bg-primary" : "w-2 bg-gray-500"
              } h-2 rounded-full`}
            />
          ))}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() =>
              setCurrPrompt(Math.min(currPrompt + 1, prompts.length - 1))
            }
          >
            <FaArrowRight />
          </Button>
        </div>
        <Progress
          value={(currPrompt / prompts.length) * 100}
          className="h-2 rounded-none"
        />
      </div>
    </div>
  );
}
