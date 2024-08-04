import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("About");

export default function AboutMe() {
  return (
    <div className="page-container">
      <p>About the project</p>
      <p>About the mission</p>
      <p>About me</p>
      <p>videos and pictures of me and my students</p>
      <p>bento grid of all these?</p>
    </div>
  );
}
