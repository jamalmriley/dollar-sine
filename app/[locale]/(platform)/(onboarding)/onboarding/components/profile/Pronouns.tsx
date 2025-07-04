"use client";

import {
  StyledActionButton,
  StyledDropdownButton,
} from "@/components/StyledButtons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdDoNotDisturb } from "react-icons/md";

export default function Pronouns() {
  const [pronouns, setPronouns] = useQueryState("pronouns", {
    defaultValue: "",
  });

  const [hasCustomPronouns, setHasCustomPronouns] = useQueryState(
    "hasCustomPronouns",
    parseAsBoolean.withDefault(false)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [subjectivePronoun, setSubjectivePronoun] = useState<string>("");
  const [objectivePronoun, setObjectivePronoun] = useState<string>("");
  const [possessivePronoun, setPossessivePronoun] = useState<string>("");

  const {
    isHeSelected,
    setIsHeSelected,
    isSheSelected,
    setIsSheSelected,
    isTheySelected,
    setIsTheySelected,
    isEySelected,
    setIsEySelected,
    isXeSelected,
    setIsXeSelected,
    isZeSelected,
    setIsZeSelected,
    preferNotToSay,
    setPreferNotToSay,
  } = useOnboardingContext();

  type PronounObj = {
    checked: boolean;
    onCheckedChange: Dispatch<SetStateAction<boolean>>;
    subjective: string;
    objective: string;
    possessive: string;
    ze?: number;
  };

  // TODO: Support Spanish pronouns
  // he: ella/ella/ellas
  // she: elle/elle/elles
  // they: el/el/ellos

  const basePronounsArr: PronounObj[] = [
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

  const morePronounsArr: PronounObj[] = [
    {
      checked: isEySelected,
      onCheckedChange: setIsEySelected,
      subjective: "ey",
      objective: "em",
      possessive: "eirs",
      // reflexive: "emself",
    },
    {
      checked: isXeSelected,
      onCheckedChange: setIsXeSelected,
      subjective: "xe",
      objective: "xem",
      possessive: "xyrs",
      // reflexive: "xemself",
    },
    {
      checked: isZeSelected,
      onCheckedChange: setIsZeSelected,
      subjective: "ze",
      objective: "hir",
      possessive: "hirs",
      // reflexive: "hirself",
    },
  ];

  // Renders properly checked pronouns upon initial load.
  useEffect(() => {
    const pronounHelper = () => {
      const splitPronouns = pronouns.split("/");
      for (const pronoun of splitPronouns) {
        if (!hasCustomPronouns) {
          if (pronoun === "he") setIsHeSelected(true);
          if (pronoun === "she") setIsSheSelected(true);
          if (pronoun === "they") setIsTheySelected(true);
          if (pronoun === "ey") setIsEySelected(true);
          if (pronoun === "xe") setIsXeSelected(true);
          if (pronoun === "ze") setIsZeSelected(true);
        }
      }
    };

    pronounHelper();
  }, []);

  // Sets pronouns based on dropdown menu selections.
  useEffect(() => {
    const getPronouns = async () => {
      if (preferNotToSay) {
        setPronouns("Prefer not to say");
        return;
      }

      const result: string[] = [];
      const arr = [...basePronounsArr, ...morePronounsArr];
      const customPronounObj: PronounObj = {
        checked: hasCustomPronouns,
        onCheckedChange: setHasCustomPronouns,
        subjective: pronouns.split("/")[0],
        objective: pronouns.split("/")[1],
        possessive: pronouns.split("/")[2],
      };

      if (hasCustomPronouns) arr.unshift(customPronounObj);
      const filteredArr = arr.filter((pronoun) => pronoun.checked);

      for (let i = 0; i < filteredArr.length; i++) {
        const pronoun = filteredArr[i];
        if (filteredArr.length === 1) {
          result.push(
            pronoun.subjective,
            pronoun.objective,
            pronoun.possessive
          );
        } else {
          result.push(pronoun.subjective);
        }
      }

      await setPronouns(result.join("/"));
    };

    getPronouns();
  }, [open]);

  const formatPronoun = (pronoun: string): string => {
    return pronoun.toLowerCase().replace(/[^a-z]/g, "");
  };
  const joinPronouns = (pronouns: string[]): string => {
    const nonBlankPronouns = pronouns.filter((pronoun) => pronoun !== "");
    return nonBlankPronouns.join("/");
  };
  const clearPronounOptions = (): void => {
    setIsHeSelected(false);
    setIsSheSelected(false);
    setIsTheySelected(false);
    setIsEySelected(false);
    setIsXeSelected(false);
    setIsZeSelected(false);
  };

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

      <Dialog>
        {/* Dropdown */}
        {/* To activate the Dialog component from within a Dropdown Menu, you must encase the Dropdown Menu component in the Dialog component. */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <StyledDropdownButton
              className={pronouns === "" ? "text-muted-foreground" : ""}
            >
              {pronouns !== "" ? pronouns : "Choose"}
            </StyledDropdownButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Custom Pronoun (if added) */}
            {hasCustomPronouns && (
              <span>
                <DropdownMenuCheckboxItem
                  checked={hasCustomPronouns}
                  onCheckedChange={() => {
                    setPronouns("");
                    setHasCustomPronouns(false);
                    setPreferNotToSay(false);
                  }}
                  onSelect={(e) => e.preventDefault()}
                  className="flex flex-col justify-center"
                >
                  <span className="w-full text-sm font-semibold">
                    {pronouns.split("/")[0]}
                  </span>
                  <span className="w-full text-xs text-muted-foreground">
                    {pronouns.split("/")[1]}/{pronouns.split("/")[2]}
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
              </span>
            )}

            {/* Base Pronouns */}
            {basePronounsArr.map((pronoun, i) => (
              <span key={i}>
                <DropdownMenuCheckboxItem
                  checked={pronoun.checked}
                  onCheckedChange={(e) => {
                    pronoun.onCheckedChange(e.valueOf());
                    setHasCustomPronouns(false);
                    setPreferNotToSay(false);
                  }}
                  onSelect={(e) => e.preventDefault()}
                  disabled={hasCustomPronouns}
                  className="flex flex-col justify-center"
                >
                  <span className="w-full text-sm font-semibold">
                    {pronoun.subjective}
                  </span>
                  <span className="w-full text-xs text-muted-foreground">
                    {pronoun.objective}/{pronoun.possessive}
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
              </span>
            ))}

            {/* More Pronouns */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="w-full text-xs border border-transparent">
                More pronouns
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {morePronounsArr.map((pronoun, i) => (
                    <span key={i}>
                      <DropdownMenuCheckboxItem
                        checked={pronoun.checked}
                        onCheckedChange={(e) => {
                          pronoun.onCheckedChange(e.valueOf());
                          setHasCustomPronouns(false);
                          setPreferNotToSay(false);
                        }}
                        onSelect={(e) => e.preventDefault()}
                        disabled={hasCustomPronouns}
                        className="flex flex-col justify-center"
                      >
                        <span className="w-full text-sm font-semibold">
                          {pronoun.subjective}
                        </span>
                        <span className="w-full text-xs text-muted-foreground">
                          {pronoun.objective}/{pronoun.possessive}
                        </span>
                      </DropdownMenuCheckboxItem>
                      {i !== morePronounsArr.length - 1 && (
                        <DropdownMenuSeparator />
                      )}
                    </span>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* "Add Your Own" and "Prefer Not to Say" */}
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem className="flex justify-between border border-transparent">
                  <span className="w-full text-xs">Add your own</span>
                  <FiPlus />
                </DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuItem
                className={`flex justify-between border ${
                  preferNotToSay ? "border-default-color" : "border-transparent"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  clearPronounOptions();
                  setPreferNotToSay(true);
                  setHasCustomPronouns(false);
                }}
              >
                <span className="w-full text-xs">Prefer not to say</span>
                <MdDoNotDisturb />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <Button className="w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add your own pronouns</DialogTitle>
            <DialogDescription>
              Add your own pronouns so we know how to properly address you.
            </DialogDescription>
          </DialogHeader>
          <form action="" className="w-full flex flex-col gap-5">
            {/* Subjective */}
            <div className="form-item">
              <Label htmlFor="firstName">Subjective Pronoun</Label>
              <Input
                value={subjectivePronoun}
                onChange={(e) =>
                  setSubjectivePronoun(formatPronoun(e.target.value))
                }
                id="subjective"
                name="subjective"
                placeholder="they"
                type="text"
                autoCapitalize="off"
                required
              />
              <span className="text-xs text-muted-foreground">
                After the quiz,{" "}
                <span className="font-bold">{subjectivePronoun || "they"}</span>{" "}
                checked their answers.
              </span>
            </div>

            <Separator decorative />

            {/* Objective */}
            <div className="form-item">
              <Label htmlFor="firstName">Objective Pronoun</Label>
              <Input
                value={objectivePronoun}
                onChange={(e) =>
                  setObjectivePronoun(formatPronoun(e.target.value))
                }
                id="objective"
                name="objective"
                placeholder="them"
                type="text"
                autoCapitalize="off"
                required
              />
              <span className="text-xs text-muted-foreground">
                I gave the calculator to{" "}
                <span className="font-bold">{objectivePronoun || "them"}</span>.
              </span>
            </div>

            <Separator decorative />

            {/* Possessive */}
            <div className="form-item">
              <Label htmlFor="firstName">Possessive Pronoun</Label>
              <Input
                value={possessivePronoun}
                onChange={(e) =>
                  setPossessivePronoun(formatPronoun(e.target.value))
                }
                id="possessive"
                name="possessive"
                placeholder="theirs"
                type="text"
                autoCapitalize="off"
                required
              />
              <span className="text-xs text-muted-foreground">
                That pencil is{" "}
                <span className="font-bold">
                  {possessivePronoun || "theirs"}
                </span>
                .
              </span>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <StyledActionButton
                type="submit"
                className="w-full"
                onClick={() => {
                  clearPronounOptions();
                  const pronouns = joinPronouns([
                    subjectivePronoun,
                    objectivePronoun,
                    possessivePronoun,
                  ]);
                  setPronouns(pronouns);
                  setHasCustomPronouns(pronouns !== "");
                  setPreferNotToSay(false);
                }}
                disabled={
                  [
                    subjectivePronoun,
                    objectivePronoun,
                    possessivePronoun,
                  ].filter((pronoun) => pronoun !== "").length !== 3
                }
              >
                Done
              </StyledActionButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
