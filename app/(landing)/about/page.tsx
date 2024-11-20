import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("About");

export default function AboutPage() {
  return (
    <div className="page-container">
      <h1 className="h1">About Us</h1>
      <p>About the project</p>
      <p>About the mission</p>
      <p>About me</p>
      <p>videos and pictures of me and my students</p>
      <p>bento grid of all these?</p>
    </div>
  );
}
