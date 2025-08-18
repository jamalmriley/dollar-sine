import { Metadata } from "next";

export const NAV_HEIGHT = 57;

export function setTitle(title: string, description: string = ""): Metadata {
  return {
    title: `${title} | Dollar Sine`,
    description,
  };
}
