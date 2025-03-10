export const EMOJI_SKIN_TONES = [
  "default",
  "light",
  "medium-light",
  "medium",
  "medium-dark",
  "dark",
] as const;

export type EmojiSkinTone = (typeof EMOJI_SKIN_TONES)[number];

type Emoji = {
  default: string;
  light: string;
  "medium-light": string;
  medium: string;
  "medium-dark": string;
  dark: string;
};

const handWave: Emoji = {
  default: "👋",
  light: "👋🏻",
  "medium-light": "👋🏼",
  medium: "👋🏽",
  "medium-dark": "👋🏾",
  dark: "👋🏿",
};

export const EMOJIS = { handWave };
