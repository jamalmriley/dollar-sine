export type SkinTone =
  | "default"
  | "light"
  | "medium-light"
  | "medium"
  | "medium-dark"
  | "dark";

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

export const emojis = { handWave };
