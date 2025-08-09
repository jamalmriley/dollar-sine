"use client";

import { StyledDropdownIconButton } from "@/components/StyledButtons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EMOJI_SKIN_TONES, EmojiSkinTone } from "@/utils/emoji";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export default function SkinTone() {
  const skinTones: { label: EmojiSkinTone; icon: string }[] = [
    { label: "default", icon: "👋" },
    { label: "light", icon: "👋🏻" },
    { label: "medium-light", icon: "👋🏼" },
    { label: "medium", icon: "👋🏽" },
    { label: "medium-dark", icon: "👋🏾" },
    { label: "dark", icon: "👋🏿" },
  ];

  const [emojiSkinTone, setEmojiSkinTone] = useQueryState(
    "emojiSkinTone",
    parseAsStringLiteral(EMOJI_SKIN_TONES).withDefault("default")
  );

  const findSkinTone = (emojiSkinTone: EmojiSkinTone) => {
    for (const obj of skinTones) {
      if (obj.label === emojiSkinTone) return obj;
    }
    return skinTones[0];
  };

  return (
    <div className="size-full flex justify-between items-center md:items-start">
      {/* Header */}
      <div className="flex flex-col">
        <span
          className={`hidden md:block text-sm font-semibold ${
            emojiSkinTone ? "text-muted-foreground line-through" : ""
          }`}
        >
          Select your skin tone.
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Emojis will be in your skin tone by default.
        </span>
      </div>

      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <StyledDropdownIconButton>
            {emojiSkinTone
              ? findSkinTone(emojiSkinTone).icon
              : skinTones[0].icon}
          </StyledDropdownIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <div className="w-full flex flex-wrap">
            {skinTones.map((obj) => (
              <DropdownMenuItem
                key={obj.label}
                className="w-[calc(33.333333%-8px)] justify-center font-semibold m-1 py-1 px-0 border border-default-color"
                onClick={() => {
                  setEmojiSkinTone(obj.label);
                }}
              >
                <span className="w-full text-center">{obj.icon}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
