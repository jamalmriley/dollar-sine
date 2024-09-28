import { GiClothes, GiConsoleController, GiEyelashes } from "react-icons/gi";
import { FaComputer } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt6() {
  const [currOptions, setCurrOptions] = useState<string[]>([]);
  const maxOptions = 5;

  const options = [
    { icon: <GiEyelashes />, label: "Beauty" },
    { icon: <GiClothes />, label: "Fashion" },
    { icon: <IoFastFood />, label: "Food" },
    { icon: <GiConsoleController />, label: "Gaming" },
    { icon: <FaComputer />, label: "Tech" },
  ].sort((a, b) => a.label.localeCompare(b.label));

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
            disabled={
              currOptions.length === maxOptions &&
              !isSelected(option.label, currOptions)
            }
          >
            {option.icon && option.icon}
            {option.label}
          </Button>
        </div>
      ))}
    </div>
  );
}
