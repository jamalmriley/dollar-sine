import { IoMdCheckboxOutline } from "react-icons/io";
import { MdDeselect } from "react-icons/md";
import { GiClothes, GiEyelashes } from "react-icons/gi";
import { FaComputer } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Prompt6() {
  const [currOptions, setCurrOptions] = useState<string[]>([]);

  const options = [
    { icon: <GiEyelashes />, label: "Beauty" },
    { icon: <GiClothes />, label: "Fashion" },
    { icon: <IoFastFood />, label: "Food" },
    { icon: <FaComputer />, label: "Gaming & Tech" },
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

  const subcategories = {
    Beauty: ["Makeup", "Skin care", "Hair products", "Fragrances"],
    Fashion: ["Nike", "Adidas"].sort(),
    Food: [
      "Chick-fil-A",
      "Chipotle",
      "McDonald's",
      "Taco Bell",
      "Burger King",
      "Five Guys",
      "Starbucks",
      "Domino's",
      "Wendy's",
      "Subway",
      "Popeyes",
      "Raising Cane's",
      "Culver's",
      "Portillo's",
      "Buffalo Wild Wings",
      "Wingstop",
      "Dunkin'",
      "Jimmy John's",
      "Crumbl",
      "Panera Bread",
    ].sort(),
    "Gaming & Tech": [
      "Apple",
      "Android",
      "Beats",
      "Mobile Gaming",
      "Nintendo Switch",
      "PC Gaming",
      "PlayStation",
      "Tabletop & Board Games",
      "VR",
      "Xbox",
    ],
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
                  : [...currOptions, option.label].sort()
              )
            }
          >
            {option.icon && option.icon}
            {option.label}
          </Button>
        </div>
      ))}

      <Accordion type="single" collapsible className="w-full">
        {currOptions.map((option: string, i: number) => (
          <AccordionItem value={option} key={i}>
            <AccordionTrigger>{option}</AccordionTrigger>
            <AccordionContent>
              <OptionsComponent options={subcategories[option as keyof typeof subcategories]} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export const OptionsComponent = ({ options }: { options: string[] }) => {
  const [currOptions, setCurrOptions] = useState<string[]>([]);

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
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          {options.map((option, i) => (
            <div className="inline-block p-2" key={i}>
              <Button
                variant={
                  isSelected(option, currOptions) ? "default" : "outline"
                }
                className={`flex gap-3 rounded-full items-center py-1 px-3 w-fit border ${
                  isSelected(option, currOptions) && "border-primary"
                }`}
                onClick={() =>
                  setCurrOptions(
                    isSelected(option, currOptions)
                      ? removeElement(option, currOptions)
                      : [...currOptions, option]
                  )
                }
              >
                {option}
              </Button>
            </div>
          ))}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IoMdCheckboxOutline className="mr-2" />
            Select
          </ContextMenuItem>
          <ContextMenuItem>
            <MdDeselect className="mr-2" />
            Deselect
          </ContextMenuItem>
          <ContextMenuItem>
            <HiOutlineInformationCircle className="mr-2" />
            More info
          </ContextMenuItem>
          <ContextMenuItem>
            <FiPlus className="mr-2" />
            Add a savings goal
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
