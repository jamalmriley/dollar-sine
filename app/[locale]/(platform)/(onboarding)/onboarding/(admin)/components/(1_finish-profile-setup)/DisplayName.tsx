"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateDisplayName } from "@/utils/user";
import { useUser } from "@clerk/nextjs";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function DisplayName() {
  const [prefix] = useQueryState("prefix", { defaultValue: "" });

  const [displayNameFormat, setDisplayNameFormat] = useQueryState(
    "displayNameFormat",
    {
      defaultValue: "",
    }
  );

  const [isPrefixIncluded, setIsPrefixIncluded] = useQueryState(
    "isPrefixIncluded",
    parseAsBoolean.withDefault(true)
  );

  const [displayName, setDisplayName] = useQueryState("displayName", {
    defaultValue: "",
  });

  const { isLoaded, isSignedIn, user } = useUser();
  const [firstName, lastName, fullName] = [
    user?.firstName,
    user?.lastName,
    user?.fullName,
  ];
  const firstInitial = (firstName && firstName[0]) || "";
  const lastInitial = (lastName && lastName[0]) || "";

  const displayNameFormats = [
    { type: "First Name", value: firstName },
    { type: "First Initial", value: firstInitial },
    { type: "Last Name", value: lastName },
    { type: "Last Initial", value: lastInitial },
    {
      type: "First Initial & Last Name",
      value: `${firstInitial}. ${lastName}`,
    },
    {
      type: "First Name & Last Initial",
      value: `${firstName} ${lastInitial}`,
    },
    { type: "Full Name", value: fullName },
  ];

  function getDisplayNameValue(displayNameFormat: string): string {
    for (const obj of displayNameFormats) {
      if (obj.type === displayNameFormat) return obj.value as string;
    }
    return "";
  }

  if (!isLoaded || !isSignedIn || !firstName || !lastName || !fullName)
    return null;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-full flex justify-between md:flex-col md:gap-4">
        {/* Header and Dropdown */}
        <div className="flex justify-between items-start">
          <div className="hidden md:flex flex-col">
            <span
              className={`text-sm font-semibold ${
                displayName !== "" ? "text-muted-foreground line-through" : ""
              }`}
            >
              Choose a display name format.
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              This is the name other users will see.
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`max-w-40 ${
                  displayNameFormat === ""
                    ? "text-muted-foreground"
                    : displayNameFormat === "First Initial & Last Name" ||
                      displayNameFormat === "First Name & Last Initial"
                    ? "text-xs"
                    : ""
                }`}
              >
                {displayNameFormat || "Choose"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Display Name Format</DropdownMenuLabel>
              {displayNameFormats.map((obj, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => {
                    const newDisplayNameFormat = obj.type as string;
                    const newDisplayNameValue = obj.value as string;
                    const newDisplayName = generateDisplayName(
                      prefix,
                      newDisplayNameValue,
                      isPrefixIncluded
                    );
                    setDisplayNameFormat(newDisplayNameFormat);
                    setDisplayName(newDisplayName);
                  }}
                >
                  {obj.type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 text-xs">
          <Checkbox
            id="includePrefix"
            checked={isPrefixIncluded}
            onClick={() => {
              setIsPrefixIncluded((val) => !val);
              const displayNameValue = getDisplayNameValue(
                displayNameFormat
              ) as string;
              const newDisplayName = generateDisplayName(
                prefix,
                displayNameValue,
                !isPrefixIncluded
              );
              setDisplayName(newDisplayName);
            }}
          />
          <label
            htmlFor="includePrefix"
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include prefix in display name
          </label>
        </div>
      </div>

      {/* Display Name */}
      {displayName !== "" && (
        <div className="flex items-baseline px-3 py-2 border rounded-lg gap-2 text-xs">
          <span>
            Your display name is{" "}
            <span className="font-semibold">{displayName}</span>.
          </span>
        </div>
      )}
    </div>
  );
}
