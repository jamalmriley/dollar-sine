import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("Support me");

export default function SupportUsPage() {
  return (
    <div className="page-container">
      <h1 className="h1">Support Us</h1>
      <p>support me for free: share my project on social media</p>
      <p>support my classroom: wish list</p>
      <p>donate: buy me coffee</p>
    </div>
  );
}
