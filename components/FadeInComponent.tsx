"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Direction = "up" | "down" | "left" | "right";

interface FadeInSectionProps {
  children: React.ReactNode;
  direction: Direction;
  delay?: number; // ms
  className?: string;
}

export default function FadeInComponent({
  children,
  direction,
  delay = 0,
  className,
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  let translate: string;
  switch (direction) {
    case "up":
      translate = "translate-y-5";
      break;
    case "down":
      translate = "-translate-y-5";
      break;
    case "left":
      translate = "translate-x-5";
      break;
    case "right":
      translate = "-translate-x-5";
      break;
    default:
      translate = "translate-x-0 translate-y-0";
      break;
  }

  return (
    <div
      className={clsx(
        "transition-all duration-700 ease-out transform",
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${translate}`,
        className
      )}
    >
      {children}
    </div>
  );
}
