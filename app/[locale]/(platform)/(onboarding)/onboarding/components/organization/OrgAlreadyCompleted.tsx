"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { OrgCard, OrgCardError, OrgCardSkeleton } from "./OrgCard";

export default function OrgAlreadyCompleted({
  tab,
}: {
  tab: "create" | "join";
}) {
  const { user, isLoaded } = useUser();
  const { isLoading, org } = useOnboardingContext();
  const [toggle, setToggle] = useState<boolean>(false);

  if (!user || !isLoaded) return;
  return (
    <div className="w-full h-full max-w-lg flex flex-col border border-default-color rounded-lg overflow-hidden">
      {isLoading ? (
        <OrgCardSkeleton toggle={toggle} />
      ) : org ? (
        <OrgCard toggle={toggle} org={org} tab={tab} />
      ) : (
        <OrgCardError toggle={toggle} />
      )}

      <Button
        variant="ghost"
        className="bg-primary-foreground rounded-none border-t border-default-color"
        onClick={() => setToggle((prev) => !prev)}
      >
        <span className="sr-only">
          {toggle
            ? "Show less organization details"
            : "Show more organization details"}
        </span>
        {toggle ? <FaChevronUp /> : <FaChevronDown />}
      </Button>
    </div>
  );
}
