"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveUserContext } from "@/contexts/active-user-context";
import { useQueryState } from "nuqs";

export default function SkinTone() {
  const skinTones = [
    { label: "default", icon: "👋" },
    { label: "light", icon: "👋🏻" },
    { label: "medium-light", icon: "👋🏼" },
    { label: "medium", icon: "👋🏽" },
    { label: "medium-dark", icon: "👋🏾" },
    { label: "dark", icon: "👋🏿" },
  ];
  const { setHasClickedOrTyped } = useActiveUserContext();

  const [skinTone, setSkinTone] = useQueryState("skinTone", {
    defaultValue: "",
  });

  const findSkinTone = (skinTone: string) => {
    for (const obj of skinTones) {
      if (obj.label === skinTone) return obj;
    }
    return skinTones[0];
  };

  return (
    <div className="w-full h-full flex justify-between items-start">
      <div className="flex flex-col">
        <span
          className={`text-sm font-semibold ${
            skinTone !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Select your skin tone.
        </span>
        <span className="text-xs font-medium text-muted-foreground mb-2">
          Your emojis will be in your skin tone by default.
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">{findSkinTone(skinTone).icon}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {skinTones.map((obj) => (
            <DropdownMenuItem
              key={obj.label}
              onClick={() => {
                setHasClickedOrTyped(true);
                setSkinTone(obj.label);
              }}
            >
              {obj.icon}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
