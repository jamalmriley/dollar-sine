"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          Emojis will be in your skin tone by default.
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{findSkinTone(skinTone).icon}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {skinTones.map((obj, i) => (
            <span key={obj.label}>
              {i !== 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => {
                  setSkinTone(obj.label);
                }}
              >
                <span className="w-full text-center">{obj.icon}</span>
              </DropdownMenuItem>
            </span>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
