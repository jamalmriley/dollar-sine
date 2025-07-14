"use client";

import { StyledDropdownButton } from "@/components/StyledButtons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateDisplayName } from "@/utils/user";
import { useUser } from "@clerk/nextjs";
import { parseAsBoolean, useQueryState } from "nuqs";
import { FiPlus } from "react-icons/fi";

export default function Prefix() {
  const prefixes: string[] = [
    "Ms.",
    "Miss",
    "Mr.",
    "Mrs.",
    "Mx.",
    "Teacher",
    "Dr.",
  ];

  const [prefix, setPrefix] = useQueryState("prefix", { defaultValue: "" });

  const [isPrefixIncluded] = useQueryState(
    "isPrefixIncluded",
    parseAsBoolean.withDefault(true)
  );

  const [displayNameFormat] = useQueryState("displayNameFormat", {
    defaultValue: "",
  });

  const [isCustomPrefix, setIsCustomPrefix] = useQueryState(
    "isCustomPrefix",
    parseAsBoolean.withDefault(false)
  );
  const [, setDisplayNameValue] = useQueryState("displayName", {
    defaultValue: "",
  });

  const { user } = useUser();
  const [firstName, lastName, fullName] = [
    user?.firstName,
    user?.lastName,
    user?.fullName,
  ];
  const firstInitial = (firstName && firstName[0]) || "";
  const lastInitial = (lastName && lastName[0]) || "";

  function getDisplayNameValue(displayNameFormat: string): string {
    const displayNameFormats = [
      { type: "First Name", value: firstName },
      { type: "First Initial", value: firstInitial },
      { type: "Last Name", value: lastName },
      { type: "Last Initial", value: lastInitial },
      {
        type: "First Initial and Last Name",
        value: `${firstInitial}. ${lastName}`,
      },
      {
        type: "First Name and Last Initial",
        value: `${firstName} ${lastInitial}`,
      },
      { type: "Full Name", value: fullName },
    ];

    for (const obj of displayNameFormats) {
      if (obj.type === displayNameFormat) return obj.value as string;
    }
    return "";
  }

  return (
    <div className="size-full flex justify-between md:flex-col">
      {/* Header */}
      <div className="flex flex-col">
        <span
          className={`hidden md:block text-sm font-semibold ${
            prefix !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Select a prefix below.
        </span>
        <span className="h-full flex items-center text-xs font-medium text-muted-foreground md:h-fit md:mb-2">
          Don&apos;t see one that fits you? <br className="block md:hidden" />
          Add your own!
        </span>
      </div>

      {/* Buttons */}

      {/* Mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="block md:hidden">
          <StyledDropdownButton>{prefix || "Choose"}</StyledDropdownButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <div className="w-full flex flex-wrap">
            {prefixes.map((prfx) => (
              <DropdownMenuItem
                key={prfx}
                className="w-[calc(33.333333%-8px)] justify-center text-xs font-semibold m-1 py-1 px-0 border border-default-color"
                onClick={(e) => {
                  e.preventDefault();
                  const displayNameValue = getDisplayNameValue(
                    displayNameFormat
                  ) as string;
                  const newDisplayName = generateDisplayName(
                    prfx,
                    displayNameValue,
                    isPrefixIncluded
                  );

                  setIsCustomPrefix(false);
                  setPrefix(prfx);
                  if (displayNameFormat !== "")
                    setDisplayNameValue(newDisplayName);
                }}
              >
                {prfx}
              </DropdownMenuItem>
            ))}

            {isCustomPrefix ? (
              <input
                className="w-[calc(66.666667%-8px)] border border-default-color m-1 py-1 pl-1 pr-0 rounded-sm text-xs focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-400"
                value={prefix}
                placeholder="Principal"
                onChange={(e) => {
                  const displayNameValue = getDisplayNameValue(
                    displayNameFormat
                  ) as string;
                  const newDisplayName = generateDisplayName(
                    e.target.value,
                    displayNameValue,
                    isPrefixIncluded
                  );

                  setPrefix(e.target.value);
                  if (displayNameFormat !== "")
                    setDisplayNameValue(newDisplayName);
                }}
              />
            ) : (
              <DropdownMenuItem
                className="w-[calc(66.666667%-8px)] flex justify-center border border-default-color m-1 py-1 px-0"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isCustomPrefix) {
                    const displayNameValue = getDisplayNameValue(
                      displayNameFormat
                    ) as string;
                    const newDisplayName = generateDisplayName(
                      "",
                      displayNameValue,
                      isPrefixIncluded
                    );

                    setIsCustomPrefix(true);
                    setPrefix("");
                    if (displayNameFormat !== "")
                      setDisplayNameValue(newDisplayName);
                  }
                }}
              >
                <span className="text-xs font-semibold">Add your own</span>
                <FiPlus />
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Desktop */}
      <div className="h-12 hidden md:flex items-center overflow-x-scroll scrollbar-custom">
        {prefixes.map((prfx) => (
          <div key={prfx} className="whitespace-nowrap px-2">
            <button
              className={`chip ${
                prfx === prefix ? "border-default-color" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                const displayNameValue = getDisplayNameValue(
                  displayNameFormat
                ) as string;
                const newDisplayName = generateDisplayName(
                  prfx,
                  displayNameValue,
                  isPrefixIncluded
                );

                setIsCustomPrefix(false);
                setPrefix(prfx);
                if (displayNameFormat !== "")
                  setDisplayNameValue(newDisplayName);
              }}
            >
              {prfx}
            </button>
          </div>
        ))}
        <span
          className={`whitespace-nowrap mx-2 focus-within:border-emerald-400 ${
            isCustomPrefix ? "chip-no-animation border-default-color" : "chip"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isCustomPrefix) {
                const displayNameValue = getDisplayNameValue(
                  displayNameFormat
                ) as string;
                const newDisplayName = generateDisplayName(
                  "",
                  displayNameValue,
                  isPrefixIncluded
                );

                setIsCustomPrefix(true);
                setPrefix("");
                if (displayNameFormat !== "")
                  setDisplayNameValue(newDisplayName);
              }
            }}
          >
            <span>Add your own{isCustomPrefix && ":"}</span>
          </button>
          <input
            className={`w-fit ${
              isCustomPrefix
                ? "focus-visible:outline-none focus-visible:ring-0 pl-1 max-w-20"
                : "hidden"
            }`}
            value={prefix}
            placeholder="Principal"
            onChange={(e) => {
              const displayNameValue = getDisplayNameValue(
                displayNameFormat
              ) as string;
              const newDisplayName = generateDisplayName(
                e.target.value,
                displayNameValue,
                isPrefixIncluded
              );

              setPrefix(e.target.value);
              if (displayNameFormat !== "") setDisplayNameValue(newDisplayName);
            }}
          />
        </span>
      </div>
    </div>
  );
}
