"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Prompt1 from "./components/Prompt1";

export default function AdminOnboardingPage() {
  const [currPrompt, setCurrPrompt] = useState<number>(0);
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState<boolean>(false);

  const prompts = [<Prompt1 />, <></>, <></>, <></>, <></>];

  /*
  [
    [
      {
        prompt: "Add your colleague(s).",
        description:
          "You can do this later if you prefer. Note that different accounts have different levels of access and permissions.",
        content: <></>,
      },
      {
        prompt: "Add your first student(s).",
        description: "You can do this later if you prefer.",
        content: <></>,
      },
      {
        prompt: "Do you want to set up accounts for parents and guardians?",
        description:
          "You can set up accounts for them or have them set up their own accounts later.",
        content: <></>,
      },
      {
        prompt: "Assign your students to classes.",
        description: "You can do this later if you prefer.",
        content: <></>,
      },
    ],
    [
      {
        prompt: "Browse courses.",
        description:
          "You can assign courses to students one at a time, by class, or all at once.",
        content: <></>,
      },
      {
        prompt: "Assign courses.",
        description:
          "You can assign courses to students one at a time, by class, or all at once.",
        content: <></>,
      },
    ],
  ];
  */

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="page-container">
        <Prompt1 />
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col justify-between h-full">
  //     <div className="page-container">
  //       <h1 className="h1 mb-10">
  //         {isOnboardingComplete ? "All done! 🥳" : "Let's get you set up."}
  //       </h1>

  //       <div className="flex justify-between gap-10">
  //         {/* Content */}
  //         <div className="w-full md:w-1/2 flex flex-col gap-5">
  //           {prompts.map((prompt, i) => (
  //             <div key={i}>{prompt}</div>
  //           ))}
  //         </div>

  //         {/* Picture */}
  //         {/* <div className="w-1/2">
  //           <Image
  //             src={images[currPrompt]}
  //             alt={""}
  //             className="object-contain mx-auto h-96"
  //           />
  //         </div> */}
  //       </div>
  //     </div>
  //     {/* Buttons, Indicators, and Progress Bar*/}
  //     <div className="flex flex-col gap-10 items-center">
  //       <div className="flex gap-5 items-center">
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="rounded-full"
  //           onClick={() => setCurrPrompt(Math.max(currPrompt - 1, 0))}
  //         >
  //           <FaArrowLeft />
  //         </Button>
  //         {prompts.map((prompt: any, i: number) => (
  //           <div
  //             key={i}
  //             onClick={() => setCurrPrompt(i)}
  //             className={`transform ease-out duration-500 ${
  //               i === currPrompt ? "w-5 bg-primary" : "w-2 bg-muted-foreground"
  //             } h-2 rounded-full`}
  //           />
  //         ))}

  //         <Button
  //           variant={currPrompt === prompts.length - 1 ? "outline" : "ghost"}
  //           size="icon"
  //           className="rounded-full"
  //           onClick={() =>
  //             setCurrPrompt(Math.min(currPrompt + 1, prompts.length - 1))
  //           }
  //         >
  //           {currPrompt === prompts.length - 1 ? <FaCheck /> : <FaArrowRight />}
  //         </Button>
  //       </div>
  //       <Progress
  //         value={(currPrompt / prompts.length) * 100}
  //         className="h-2 rounded-none"
  //       />
  //     </div>
  //   </div>
  // );
}
