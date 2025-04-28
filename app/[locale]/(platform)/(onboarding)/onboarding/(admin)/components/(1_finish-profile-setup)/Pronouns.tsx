"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useQueryState } from "nuqs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Pronouns() {
  const [pronouns, setPronouns] = useQueryState("pronouns", {
    defaultValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const {
    isHeSelected,
    setIsHeSelected,
    isSheSelected,
    setIsSheSelected,
    isTheySelected,
    setIsTheySelected,
  } = useOnboardingContext();

  type PronounObj = {
    checked: boolean;
    onCheckedChange: Dispatch<SetStateAction<boolean>>;
    subjective: string;
    objective: string;
    possessive: string;
  };

  // TODO: Support Spanish pronouns
  // he: ella/ella/ellas
  // she: elle/elle/elles
  // they: el/el/ellos

  const pronounsArr: PronounObj[] = [
    {
      checked: isHeSelected,
      onCheckedChange: setIsHeSelected,
      subjective: "he",
      objective: "him",
      possessive: "his",
      // reflexive: "himself",
    },
    {
      checked: isSheSelected,
      onCheckedChange: setIsSheSelected,
      subjective: "she",
      objective: "her",
      possessive: "hers",
      // reflexive: "herself",
    },
    {
      checked: isTheySelected,
      onCheckedChange: setIsTheySelected,
      subjective: "they",
      objective: "them",
      possessive: "theirs",
      // reflexive: "themself",
    },
  ];

  // Renders properly checked pronouns upon initial load.
  useEffect(() => {
    const pronounHelper = () => {
      const splitPronouns = pronouns.split("/");
      for (const pronoun of splitPronouns) {
        if (pronoun === "he") setIsHeSelected(true);
        if (pronoun === "she") setIsSheSelected(true);
        if (pronoun === "they") setIsTheySelected(true);
      }
    };

    pronounHelper();
  }, []);

  // Sets pronouns based on dropdown menu selections.
  useEffect(() => {
    const getPronouns = async () => {
      const result: string[] = [];
      const arr = pronounsArr.filter((pronoun) => pronoun.checked);
      for (let i = 0; i < arr.length; i++) {
        const pronoun = arr[i];
        if (arr.length === 1) {
          result.push(
            pronoun.subjective,
            pronoun.objective,
            pronoun.possessive
          );
        } else {
          result.push(pronoun.subjective);
        }
      }

      if (result.length) await setPronouns(result.join("/"));
    };

    getPronouns();
  }, [open]);

  return (
    <div className="size-full flex justify-between items-center md:items-start">
      {/* Header */}
      <div className="flex flex-col">
        <span
          className={`hidden md:block text-sm font-semibold ${
            pronouns ? "text-muted-foreground line-through" : ""
          }`}
        >
          Add your pronouns.
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Choose as many as you&apos;d like!
        </span>
      </div>

      {/* Dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={pronouns === "" ? "text-muted-foreground" : ""}
          >
            {pronouns !== "" ? pronouns : "Choose"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">
            Pronouns
          </DropdownMenuLabel>
          {pronounsArr.map((pronoun, i) => (
            <span key={i}>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={pronoun.checked}
                onCheckedChange={pronoun.onCheckedChange}
                onSelect={(e) => e.preventDefault()}
                className="flex flex-col justify-center"
              >
                <span className="w-full text-sm font-semibold">
                  {pronoun.subjective}
                </span>
                <span className="w-full text-xs text-muted-foreground">
                  {pronoun.objective}/{pronoun.possessive}
                </span>
              </DropdownMenuCheckboxItem>
            </span>
          ))}
          <Button
            className="w-full mt-5"
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
