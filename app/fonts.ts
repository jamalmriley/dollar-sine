import { Cedarville_Cursive, Inter, Lora } from "next/font/google";

export const cedarvilleCursive = Cedarville_Cursive({
  weight: "400",
  subsets: ["latin"],
});
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
