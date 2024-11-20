import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt1() {
  const [currOptions, setCurrOptions] = useState<string[]>([]);
  const options: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { label: "Mom" },
    { label: "Dad" },
    { label: "Stepmom" },
    { label: "Stepdad" },
    { label: "Siblings" },
    { label: "Grandma" },
    { label: "Grandpa" },
    { label: "Aunt" },
    { label: "Uncle" },
    { label: "Great-grandma" },
    { label: "Great-grandpa" },
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

  return (
    <div className="pt-8">
      {options.map((option, i) => (
        <div className="inline-block p-2" key={i}>
          <Button
            variant={
              isSelected(option.label, currOptions) ? "default" : "outline"
            }
            className={`flex gap-3 rounded-full items-center py-1 px-3 w-fit border ${
              isSelected(option.label, currOptions) && "border-primary"
            }`}
            onClick={() =>
              setCurrOptions(
                isSelected(option.label, currOptions)
                  ? removeElement(option.label, currOptions)
                  : [...currOptions, option.label]
              )
            }
          >
            {/* {option.icon} */}
            {option.label}
          </Button>
        </div>
      ))}
    </div>
  );
}
