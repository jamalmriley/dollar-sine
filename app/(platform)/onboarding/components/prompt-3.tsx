import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt3() {
  const [currOptions, setCurrOptions] = useState<string[]>([]);
  const [petCount, setPetCount] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const options: string[] = [
    "Dog",
    "Cat",
    "Fish",
    "Bird",
    "Hamster",
    "Gerbil",
    "Guinea pig",
    "Turtle",
    "Snake",
    "Lizard",
  ];

  const isSelected = (value: string, options: string[]) => {
    for (const option of options) {
      if (value === option) return true;
    }
    return false;
  };

  const removeElement = (value: string, arr: string[]) => {
    const result: string[] = [];
    for (const el of arr) {
      if (el !== value) result.push(el);
    }
    return result;
  };

  const updateElement = (value: string, index: number, arr: number[]) => {
    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === index) newArr.push(parseInt(value) || 0);
      else newArr.push(arr[i]);
    }

    return newArr;
  };

  return (
    <div className="pt-8">
      {options.map((option, i) => (
        <div className="inline-block p-2" key={i}>
          <Button
            variant={isSelected(option, currOptions) ? "default" : "outline"}
            className={`flex gap-3 rounded-full items-center py-1 px-3 w-fit border ${
              isSelected(option, currOptions) && "border-primary"
            }`}
            onClick={() => {
              !isSelected(option, currOptions) &&
                setCurrOptions([...currOptions, option]);
              !isSelected(option, currOptions) &&
                setPetCount(updateElement("1", i, petCount));
            }}
          >
            {isSelected(option, currOptions) && (
              <input
                // type="number"
                placeholder="1"
                value={petCount[i]}
                onChange={(e) =>
                  (parseInt(e.target.value) <= 99 || e.target.value === "") &&
                  setPetCount(updateElement(e.target.value, i, petCount))
                }
                className="bg-[transparent] outline-none w-5 text-center"
              />
            )}
            {isSelected(option, currOptions)
              ? `${option.toLowerCase()}${petCount[i] === 1 ? "" : "s"}`
              : option === "Fish"
              ? `${option}(es)`
              : `${option}(s)`}
            {isSelected(option, currOptions) && (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-5 h-5"
                onClick={() => {
                  setCurrOptions(removeElement(option, currOptions));
                  setPetCount(updateElement("0", i, petCount));
                }}
              >
                <IoMdClose size="icon" />
              </Button>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
