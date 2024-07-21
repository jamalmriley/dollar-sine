import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("About me");

export default function AboutMe() {
  return (
    <div className="page-container">About me</div>
  )
}