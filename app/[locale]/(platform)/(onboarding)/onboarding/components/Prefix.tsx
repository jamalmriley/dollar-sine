"use client";

import { generateDisplayName } from "@/utils/user";
import { useUser } from "@clerk/nextjs";
import { parseAsBoolean, useQueryState } from "nuqs";

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
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="hidden md:flex flex-col">
        <span
          className={`text-sm font-semibold ${
            prefix !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Select a prefix below.
        </span>
        <span className="text-xs font-medium text-muted-foreground mb-2">
          Don&apos;t see one that fits you? Add your own!
        </span>
      </div>

      {/* Buttons */}
      <div className="h-12 flex items-center overflow-x-scroll scrollbar-custom">
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
        <span className={`whitespace-nowrap px-2`}>
          <button
            className={
              isCustomPrefix
                ? "chip-no-animation border-primary rounded-r-none border-r-0 pr-2"
                : "chip"
            }
            onClick={(e) => {
              e.preventDefault();
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
              if (displayNameFormat !== "") setDisplayNameValue(newDisplayName);
            }}
          >
            <span>Add your own{isCustomPrefix && ":"}</span>
          </button>
          <input
            className={
              isCustomPrefix
                ? "border border-primary rounded-full rounded-l-none border-l-0 text-xs py-1 max-w-20"
                : "hidden"
            }
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
