"use client";

import Spotlight from "@/components/Spotlight";
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";

export default function TestSpotlightComponent() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) return null;
  return (
    <>
      <Spotlight targetRef={targetRef} />
      <div className="flex gap-5">
        <div className="h-32 w-1/5 border rounded-xl" ref={targetRef} />
        <div className="h-32 w-1/5 border rounded-xl" />
        <div className="h-32 w-1/5 border rounded-xl" />
        <div className="h-32 w-1/5 border rounded-xl" />
        <div className="h-32 w-1/5 border rounded-xl" />
      </div>
    </>
  );
}
