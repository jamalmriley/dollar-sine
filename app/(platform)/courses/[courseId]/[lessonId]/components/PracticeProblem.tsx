import { StyledButton } from "@/components/StyledButton";
import {
  MdClose,
  MdPlayCircleOutline,
  MdSlowMotionVideo,
} from "react-icons/md";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FaRegQuestionCircle } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Prompt {
  id: string;
  text: string[][];
  // hasAnswerOptions: boolean;
  // answer: number | string;
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
const examplePrompts: Prompt[] = Array(5).fill(examplePrompt);

const answerOptions = ["A", "B", "C", "D"];

export default function PracticeProblem() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  return (
    <div className="size-full flex flex-col justify-between bg-primary-foreground">
      <div className="size-full p-5 flex flex-col justify-between">
        {/* Question and Buttons */}
        <span className="flex items-center gap-3">
          <span>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {examplePrompts.length}
            </p>
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
          {examplePrompts[currentQuestion].text.map((paragraph, i) => (
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
                className={`w-full flex items-center rounded-md p-2 gap-2.5 cursor-pointer group ${
                  selectedAnswer === i
                    ? "bg-dodger-blue-100 dark:bg-[#121212] border border-dodger-blue-500 text-dodger-blue-800"
                    : "hover:bg-dodger-blue-50 hover:border-dodger-blue-500 border border-default-color"
                }`}
                onClick={() => setSelectedAnswer(i)}
              >
                <div
                  className={`min-w-[26px] size-[26px] flex justify-center items-center rounded-md border group-hover:border-dodger-blue-500 group-hover:text-dodger-blue-800 ${selectedAnswer === i ? "border-dodger-blue-500" : "border-default-color"}`}
                >
                  {answerOptions[i]}
                </div>
                <div className="w-full line-clamp-1 group-hover:text-dodger-blue-800">
                  Option {i + 1}
                </div>

                <div className="ml-auto hidden group-hover:block">
                  <MdClose />
                </div>
              </span>
            ))}
        </div>

        {/* Buttons and Indicators */}
        <div className="flex justify-between items-center">
          <StyledButton
            buttonType="action"
            isIconButton={true}
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft />
          </StyledButton>

          <div className="flex justify-center items-center  gap-4">
            {examplePrompts.map((_, i) => (
              <div
                key={i}
                className={`transform ease-out duration-500 ${
                  i === currentQuestion
                    ? "w-5 bg-emerald-400 border border-default-color"
                    : "w-2 bg-muted-foreground/30 border border-muted-foreground/30"
                } h-2 rounded-full`}
              />
            ))}
          </div>

          <StyledButton
            buttonType="action"
            isIconButton={true}
            onClick={() =>
              setCurrentQuestion((prev) =>
                Math.min(prev + 1, examplePrompts.length - 1)
              )
            }
            disabled={currentQuestion === examplePrompts.length - 1}
          >
            <ArrowRight />
          </StyledButton>
        </div>
      </div>
      <Progress
        value={(currentQuestion / examplePrompts.length) * 100}
        className="h-2 rounded-none"
      />
    </div>
  );
}
