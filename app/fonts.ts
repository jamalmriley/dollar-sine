import { Inter, Lora } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], display: "swap" });
export const lora = Lora({
  subsets: ["latin", "math"],
  display: "swap",
});
export const loraItalic = Lora({
  subsets: ["latin", "math"],
  display: "swap",
  style: "italic",
});
