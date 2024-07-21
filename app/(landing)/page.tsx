import { lora, loraItalic } from "@/app/fonts";
import ThreeDCard from "@/components/home/hero-ipad";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const definitions = [
    "a website that teaches students about consumer math and financial literacy.",
    "a cool project made by just a STEM teacher.",
    "proof that with hard work, anything is possible.",
  ];
  return (
    // <main className="page-container flex justify-center">
    <main className="flex justify-center">
      <ThreeDCard />
    </main>
  );
}
