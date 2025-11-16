import { StyledButton } from "@/components/StyledButton";
import { MdPlayCircleOutline, MdSlowMotionVideo } from "react-icons/md";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FaRegQuestionCircle } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { alphabet } from "@/utils/general";
import { Input } from "@/components/ui/input";

interface Problem {
  id: string;
  text: string[][];
  type: "multiple-choice" | "short-answer";
  answer: (number | string)[];
  options?: (number | string)[];
}

const exampleProblem: Problem = {
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
    ["Here", "is", "another", "paragraph", "for", "the", "example", "."],
  ],
  type: "multiple-choice",
  answer: [0],
  options: [0, 1, 2, 3],
};
const exampleProblems: Problem[] = Array(5).fill(exampleProblem);

export default function PracticeProblem() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  // const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // const [eliminatedAnswers, setEliminatedAnswers] = useState<number[] | null>(
  //   null
  // );
  return (
    <div className="size-full flex flex-col justify-between bg-primary-foreground">
      <div className="size-full p-5 flex flex-col justify-between">
        {/* Label and Buttons */}
        <span className="flex items-center gap-3">
          <span>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {exampleProblems.length}
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
          {exampleProblems[currentQuestion].text.map((paragraph, i) => (
            <p key={i} className="lg:text-xl font-semibold w-full select-none">
              {paragraph.map((word, j) => {
                const isPunctuation = /^[.,!?;:)]$/.test(word[0]);
                return (
                  <span key={j}>
                    {j !== 0 && !isPunctuation ? " " : ""}
                    <span
                      className={
                        isPunctuation
                          ? ""
                          : "hover:bg-dodger-blue-200 hover:border-x hover:border-default-color hover:px-2 border-y border-transparent rounded-sm transition-all ease-in-out duration-200"
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
        <div
          className={
            exampleProblems[currentQuestion].type === "multiple-choice"
              ? "grid grid-cols-2 gap-3"
              : ""
          }
        >
          {exampleProblems[currentQuestion].options ? (
            exampleProblems[currentQuestion].options.map((option, i) => (
              <span
                key={i}
                className={`w-full flex items-center rounded-md gap-2.5 group cursor-pointer`}
              >
                {/* Answer Label */}
                <div
                  className={`min-w-7 min-h-7 size-7 flex justify-center items-center rounded-md p-2 border`}
                >
                  {alphabet[i]}
                </div>

                {/* Answer Option */}
                <div className="w-full line-clamp-1">{option}</div>
              </span>
            ))
          ) : (
            <div className="w-full flex gap-2 justify-center">
              <Input type="number" placeholder="0" className="w-20" />
              <Input type="text" placeholder="units" className="w-40" />
            </div>
          )}
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
            {exampleProblems.map((_, i) => (
              <div
                key={i}
                className={`transform ease-out duration-500 ${
                  i === currentQuestion
                    ? "w-5 bg-emerald-400 border-default"
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
                Math.min(prev + 1, exampleProblems.length - 1)
              )
            }
            disabled={currentQuestion === exampleProblems.length - 1}
          >
            <ArrowRight />
          </StyledButton>
        </div>
      </div>
      <Progress
        value={(currentQuestion / exampleProblems.length) * 100}
        className="h-2 rounded-none"
      />
    </div>
  );
}

{
  /* "Eliminate" button 
                <div
                  className="min-w-7 min-h-7 size-7 flex items-center rounded-md p-2 border"
                  onClick={() => {
                    if (eliminatedAnswers && eliminatedAnswers.includes(i)) {
                      setEliminatedAnswers(
                        eliminatedAnswers.filter((ans) => ans !== i)
                      );
                    } else {
                      setEliminatedAnswers((prev) =>
                        prev ? [...prev, i] : [i]
                      );
                      if (selectedAnswer === i) setSelectedAnswer(null);
                    }
                  }}
                >
                  <MdClose />
                </div>
  */
}
