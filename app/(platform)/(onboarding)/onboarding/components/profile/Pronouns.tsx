"use client";

import { StyledButton } from "@/components/StyledButton";
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
import {
  PRONOUN_KEYS,
  PronounKey,
  useOnboardingContext,
} from "@/contexts/onboarding-context";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdDoNotDisturb } from "react-icons/md";

export default function Pronouns() {
  const { selectedPronouns, setSelectedPronouns } = useOnboardingContext();
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

  type PronounObj = {
    subjective: PronounKey;
    objective: string;
    possessive: string;
  };

  // TODO: Support Spanish pronouns
  // he: ella/ella/ellas
  // she: elle/elle/elles
  // they: el/el/ellos

  const basePronounsArr: PronounObj[] = [
    {
      subjective: "he",
      objective: "him",
      possessive: "his",
      // reflexive: "himself",
    },
    {
      subjective: "she",
      objective: "her",
      possessive: "hers",
      // reflexive: "herself",
    },
    {
      subjective: "they",
      objective: "them",
      possessive: "theirs",
      // reflexive: "themself",
    },
  ];
  const morePronounsArr: PronounObj[] = [
    {
      subjective: "ey",
      objective: "em",
      possessive: "eirs",
      // reflexive: "emself",
    },
    {
      subjective: "xe",
      objective: "xem",
      possessive: "xyrs",
      // reflexive: "xemself",
    },
    {
      subjective: "ze",
      objective: "hir",
      possessive: "hirs",
      // reflexive: "hirself",
    },
  ];

  function formatPronoun(pronoun: string): string {
    return pronoun.toLowerCase().replace(/[^a-z]/g, "");
  }

  // Renders pronouns properly upon load/refresh.
  useEffect(() => {
    if (!pronouns || hasCustomPronouns) return;
    if (pronouns === "Prefer not to say") {
      setSelectedPronouns(["PNTS"]);
      return;
    }

    const splitPronouns = pronouns.split("/");

    // Try to reverse-match a full triad (e.g., "they/them/theirs")
    const allPronouns = [...basePronounsArr, ...morePronounsArr];
    const triadMatch = allPronouns.find(
      (p) =>
        splitPronouns[0] === p.subjective &&
        splitPronouns[1] === p.objective &&
        splitPronouns[2] === p.possessive
    );

    if (triadMatch) {
      setSelectedPronouns([triadMatch.subjective]);
      return;
    }

    // Fall back to valid subjective-only keys
    const validPronounKeys = splitPronouns.filter((p) =>
      PRONOUN_KEYS.includes(p as PronounKey)
    );
    if (validPronounKeys.length > 0) {
      setSelectedPronouns(validPronounKeys as PronounKey[]);
    }
  }, [pronouns, hasCustomPronouns]);

  // Sets pronouns based on dropdown menu selections.
  useEffect(() => {
    if (open || hasCustomPronouns) return; // Only run the following code if the dropdown is closed or if it is not set to "Prefer not to say".
    if (selectedPronouns.length === 0) {
      setPronouns("");
      return;
    }
    if (selectedPronouns.length === 1 && selectedPronouns[0] === "PNTS") {
      setPronouns("Prefer not to say");
      return;
    }

    const allPronouns = [...basePronounsArr, ...morePronounsArr];
    const fullPronouns = selectedPronouns
      .map((key) => allPronouns.find((pronoun) => pronoun.subjective === key))
      .filter((p): p is PronounObj => p !== undefined);

    const result: string[] = [];

    if (fullPronouns.length === 1) {
      const p = fullPronouns[0];
      result.push(p.subjective, p.objective, p.possessive);
    } else {
      result.push(...fullPronouns.map((p) => p.subjective));
    }

    setPronouns(result.join("/"));
  }, [open, selectedPronouns]);

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
            <StyledButton
              className={pronouns === "" ? "text-muted-foreground" : ""}
            >
              {pronouns || "Choose"}
            </StyledButton>
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
                    setSelectedPronouns([]);
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
              <span key={pronoun.subjective}>
                <DropdownMenuCheckboxItem
                  checked={selectedPronouns.includes(pronoun.subjective)}
                  onCheckedChange={(checked) => {
                    setSelectedPronouns((prev) =>
                      checked
                        ? [
                            ...prev.filter((p) => p !== "PNTS"),
                            pronoun.subjective,
                          ]
                        : prev.filter((p) => p !== pronoun.subjective)
                    );
                    setHasCustomPronouns(false);
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
                {i !== morePronounsArr.length - 1 && <DropdownMenuSeparator />}
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
                    <span key={pronoun.subjective}>
                      <DropdownMenuCheckboxItem
                        checked={selectedPronouns.includes(pronoun.subjective)}
                        onCheckedChange={(checked) => {
                          setSelectedPronouns((prev) =>
                            checked
                              ? [
                                  ...prev.filter((p) => p !== "PNTS"),
                                  pronoun.subjective,
                                ]
                              : prev.filter((p) => p !== pronoun.subjective)
                          );
                          setHasCustomPronouns(false);
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
                  selectedPronouns.includes("PNTS")
                    ? "border-default-color"
                    : "border-transparent"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPronouns(["PNTS"]);
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
              <StyledButton
                buttonType="action"
                type="submit"
                className="w-full"
                onClick={() => {
                  const pronouns = [
                    subjectivePronoun,
                    objectivePronoun,
                    possessivePronoun,
                  ].join("/");
                  setPronouns(pronouns);
                  setHasCustomPronouns(true);
                  setSelectedPronouns([]);
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
              </StyledButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
