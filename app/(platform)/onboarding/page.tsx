"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Prompt1Svg from "@/assets/svg/undraw_family_vg76.svg";
import Prompt3Svg from "@/assets/svg/undraw_passing_by_0un9.svg";
import Prompt4Svg from "@/assets/svg/undraw_true_friends_c-94-g.svg";
import Prompt5Svg from "@/assets/svg/undraw_biking_kc-4-f.svg";
import Prompt6Svg from "@/assets/svg/undraw_favourite_item_pcyo.svg";
import Prompt7Svg from "@/assets/svg/undraw_special_event_-4-aj8.svg";
import Prompt8Svg from "@/assets/svg/undraw_savings_re_eq4w.svg";
import Prompt1 from "./components/prompt-1";
import Prompt2 from "./components/prompt-2";
import Prompt4 from "./components/prompt-4";
import Prompt5 from "./components/prompt-5";
import Prompt7 from "./components/prompt-7";
import Prompt8 from "./components/prompt-8";

export default function OnboardingPage() {
  const [currPrompt, setCurrPrompt] = useState<number>(0);
  const images = [
    Prompt1Svg,
    Prompt3Svg,
    Prompt4Svg,
    Prompt5Svg,
    Prompt6Svg,
    Prompt7Svg,
    Prompt8Svg,
  ];
  const prompts = [
    [
      {
        prompt: "Who do you mainly live with at home?",
        description:
          "If you live in more than one home, choose the relative(s) you live with more.",
        content: <Prompt1 />,
      },
      {
        prompt: "What siblings do you live with?",
        description: "",
        content: <Prompt2 />,
      },
    ],
    // [
    //   {
    //     prompt: "Do you have any pets?",
    //     description: "",
    //   },
    // ],
    [
      {
        prompt: "How do you mainly get to school?",
        description:
          "If you have more than one way of getting to school, choose the way you get to school more often.",
        content: <Prompt4 />,
      },
    ],
    [
      {
        prompt: "What are some of your interests?",
        description: "Select up to five interests.",
        content: <Prompt5 />,
      },
    ],
    // [
    //   {
    //     prompt: "What are some things you like to spend money on?",
    //     description: "Select all that apply.",
    //   },
    // ],
    [
      {
        prompt: "How many days per week do you order food or go out to eat?",
        description: "",
        content: <Prompt7 />,
      },
    ],
    [
      {
        prompt: "Is there anything that you're saving up for?",
        description: "",
        content: <Prompt8 />,
      },
    ],
    // [{
    //   prompt: "",
    //   description: "",
    //   image: "",
    // }],
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="page-container">
        <h1 className="h1 mb-10">Let's get to know you a bit.</h1>

        <div className="flex justify-between gap-10">
          {/* Prompt */}
          <div className="w-1/2 flex flex-col gap-5">
            {prompts[currPrompt].map((prompt, i) => (
              <div key={i}>
                <h2 className="h2">{prompt.prompt}</h2>
                <span className="subtitle">{prompt.description}</span>
                {prompt.content && prompt.content}
              </div>
            ))}
          </div>

          {/* Picture */}
          <div className="w-1/2">
            <Image
              src={images[currPrompt]}
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
