import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt7() {
  const [currOption, setCurrOption] = useState<string>("");
  const options: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="flex gap-3 px-2 pt-8 justify-center">
      {options.map((option, i) => (
        <Button
          variant={option === currOption ? "default" : "outline"}
          className="w-10 h-10 rounded-full"
          onClick={() => setCurrOption(option === currOption ? "" : option)}
        >
          {option[0] === "S" || option[0] === "T"
            ? option.substring(0, 2)
            : option[0]}
        </Button>
      ))}
    </div>
  );
}
