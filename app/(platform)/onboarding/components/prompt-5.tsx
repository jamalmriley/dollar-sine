import { IoIosBaseball, IoIosBasketball } from "react-icons/io";
import {
  MdOutlineDirectionsBike,
  MdSportsGymnastics,
  MdSportsMartialArts,
} from "react-icons/md";
import {
  GiSoccerBall,
  GiAmericanFootballBall,
  GiBowlingStrike,
  GiVolleyballBall,
  GiRunningShoe,
  GiBoxingGlove,
  GiPaintBrush,
  GiClothes,
  GiConsoleController,
  GiSing,
  GiDramaMasks,
  GiPearlNecklace,
  GiBallerinaShoes,
  GiMusicalNotes,
} from "react-icons/gi";
import { FaSwimmer, FaCameraRetro, FaPencilAlt, FaChess } from "react-icons/fa";
import { PiPersonSimpleHikeFill } from "react-icons/pi";
import {
  FaPenFancy,
  FaGuitar,
  FaPuzzlePiece,
  FaLaptopCode,
  FaBookOpenReader,
} from "react-icons/fa6";
import { TbNeedleThread } from "react-icons/tb";
import { BsMusicPlayer } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Prompt5() {
  const [currOptions, setCurrOptions] = useState<string[]>([]);
  const maxOptions = 5;

  const creativeOptions: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { icon: <FaPencilAlt />, label: "Drawing" },
    { icon: <GiPaintBrush />, label: "Painting" },
    { icon: <FaPenFancy />, label: "Creative Writing" },
    { icon: <FaCameraRetro />, label: "Photography" },
    { icon: <TbNeedleThread />, label: "Knitting" },
    { icon: <GiSing />, label: "Singing" },
    { icon: <FaGuitar />, label: "Playing an instrument" },
    { icon: <GiBallerinaShoes />, label: "Dancing" },
    { icon: <GiPearlNecklace />, label: "Jewelry Making" },
    { icon: <GiClothes />, label: "Fashion" },
    { icon: <GiDramaMasks />, label: "Drama" },
    { icon: <GiMusicalNotes />, label: "Making music" },
  ];

  const athleticOptions: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { icon: <MdSportsGymnastics />, label: "Gymnastics" },
    { icon: <GiRunningShoe />, label: "Track & Field" },
    { icon: <IoIosBasketball />, label: "Basketball" },
    { icon: <IoIosBaseball />, label: "Baseball" },
    { icon: <GiSoccerBall />, label: "Soccer" },
    { icon: <MdOutlineDirectionsBike />, label: "Biking" },
    { icon: <GiAmericanFootballBall />, label: "Football" },
    { icon: <FaSwimmer />, label: "Swimming" },
    { icon: <MdSportsMartialArts />, label: "Martial Arts" },
    { icon: <GiBoxingGlove />, label: "Boxing" },
    { icon: <GiVolleyballBall />, label: "Volleyball" },
    { icon: <GiBowlingStrike />, label: "Bowling" },
    { icon: <PiPersonSimpleHikeFill />, label: "Hiking" },
  ];

  const academicOptions: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { icon: <FaChess />, label: "Chess" },
    { icon: <FaPuzzlePiece />, label: "Puzzles" },
    { icon: <FaLaptopCode />, label: "Coding" },
    { icon: <FaBookOpenReader />, label: "Reading" },
  ];

  const leisureOptions: {
    icon?: JSX.Element;
    label: string;
  }[] = [
    { icon: <GiConsoleController />, label: "Video games" },
    { icon: <BsMusicPlayer />, label: "Listening to music" },
  ];

  const options = [
    ...creativeOptions,
    ...athleticOptions,
    ...academicOptions,
    ...leisureOptions,
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
