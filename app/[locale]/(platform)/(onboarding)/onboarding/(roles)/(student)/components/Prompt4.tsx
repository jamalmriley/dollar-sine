import { FaCar, FaWalking, FaUber } from "react-icons/fa";
import { MdTrain, MdEmojiTransportation } from "react-icons/md";
import { BiSolidBusSchool } from "react-icons/bi";
import { FaVanShuttle } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt4() {
  const [currOption, setCurrOption] = useState<string>("");
  const options: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { icon: <FaCar />, label: "Car" },
    { icon: <MdTrain />, label: "Public transportation" },
    { icon: <BiSolidBusSchool />, label: "School bus" },
    { icon: <FaWalking />, label: "Walking" },
    { icon: <FaVanShuttle />, label: "Carpooling" },
    { icon: <FaUber />, label: "Ridesharing" },
    { icon: <MdEmojiTransportation />, label: "Other" },
  ];
  return (
    <div className="pt-8">
      {options.map((option, i) => (
        <div className="inline-block p-2" key={i}>
          <Button
            variant={option.label === currOption ? "default" : "outline"}
            className={`flex gap-3 rounded-full items-center py-1 px-3 w-fit border ${
              option.label === currOption && "border-primary"
            }`}
            onClick={() =>
              setCurrOption(option.label === currOption ? "" : option.label)
            }
          >
            {option.icon}
            {option.label}
          </Button>
        </div>
      ))}
    </div>
  );
}
