import LessonComponentContainer from "./LessonComponentContainer";

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

export default function PracticeProblem() {
  return (
    <LessonComponentContainer className="md:border-t aspect-auto p-5 flex flex-col gap-5">
      {examplePrompt.text.map((paragraph, i) => (
        <p key={i} className="text-2xl font-semibold w-full">
          {paragraph.map((word, j) => {
            const isPunctuation = /^[.,!?;:)]$/.test(word[0]);
            return (
              <span key={j}>
                {j !== 0 && !isPunctuation ? " " : ""}
                <span
                  className={
                    isPunctuation
                      ? ""
                      : "hover:bg-blue-200 hover:px-2 rounded-sm transition-all ease-in-out duration-200"
                  }
                >
                  {word}
                </span>
              </span>
            );
          })}
        </p>
      ))}
    </LessonComponentContainer>
  );
}
