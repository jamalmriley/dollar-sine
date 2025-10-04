import { StyledButton } from "@/components/StyledButton";
import { MdPlayCircleOutline, MdSlowMotionVideo } from "react-icons/md";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FaRegQuestionCircle } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Prompt {
  id: string;
  text: string[][];
}

const examplePrompt: Prompt = {
  id: "example",
  text: [
    [
      "This",
      "is",
      "an",
      "example",
      "of",
      "a",
      "first",
      "paragraph",
      ".",
      "It",
      "has",
      "multiple",
      "sentences",
      ".",
      "Here's",
      "another",
      "sentence",
      ",",
      "this",
      "time",
      "with",
      "a",
      "comma",
      ".",
      "And",
      "a",
      "cliffhanger",
      "...",
    ],
    ["Here", "is", "another", "paragraph", "for", "the", "example."],
  ],
};

const answerOptions = ["A", "B", "C", "D"];

export default function PracticeProblem() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  return (
    <div className="size-full flex flex-col justify-between">
      <div className="size-full p-5 flex flex-col justify-between">
        {/* Question and Buttons */}
        <span className="flex items-center gap-3">
          <span>
            <p className="text-xs text-muted-foreground">Question 1 of 1</p>
            <p className="text-sm font-bold">Multiple Choice</p>
          </span>
          <StyledButton isIconButton={true}>
            <MdPlayCircleOutline />
          </StyledButton>
          <StyledButton isIconButton={true}>
            <MdSlowMotionVideo />
          </StyledButton>

          <StyledButton isIconButton={true} className="ml-auto">
            <FaRegQuestionCircle />
          </StyledButton>
        </span>

        {/* Question */}
        <div className="flex flex-col gap-5">
          {examplePrompt.text.map((paragraph, i) => (
            <p key={i} className="lg:text-xl font-semibold w-full">
              {paragraph.map((word, j) => {
                const isPunctuation = /^[.,!?;:)]$/.test(word[0]);
                return (
                  <span key={j}>
                    {j !== 0 && !isPunctuation ? " " : ""}
                    <span
                      className={
                        isPunctuation
                          ? ""
                          : "hover:bg-dodger-blue-200 hover:px-2 rounded-sm transition-all ease-in-out duration-200"
                      }
                    >
                      {word}
                    </span>
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className={`w-full flex rounded-md p-2 gap-2.5 cursor-pointer ${
                  selectedAnswer === i
                    ? "bg-dodger-blue-100 border-2 border-dodger-blue-500"
                    : "border border-default-color hover:bg-gray-100"
                }`}
                onClick={() => setSelectedAnswer(i)}
              >
                <div className="min-w-[26px] size-[26px] flex justify-center items-center rounded-md border border-default-color">
                  {answerOptions[i]}
                </div>
                <div className="w-full line-clamp-1">Option {i + 1}</div>
              </span>
            ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <StyledButton buttonType="action" isIconButton={true}>
            <ArrowLeft />
          </StyledButton>

          <StyledButton buttonType="action" isIconButton={true}>
            <ArrowRight />
          </StyledButton>
        </div>
      </div>
      <Progress value={50} className="h-2 rounded-none" />
    </div>
  );
}
