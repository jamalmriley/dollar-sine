"use client";

import CustomH1 from "@/components/CustomH1";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Greeting({
  name,
}: {
  name: String | null | undefined;
}) {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting =
    time.getHours() < 12
      ? "Good morning"
      : time.getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  const emoji =
    time.getHours() < 12 ? "☀️" : time.getHours() < 18 ? "👋🏿" : "🌙";
  if (!isLoaded) {
    return (
      <div className="flex gap-3 md:gap-4 lg:gap-5 mb-5">
        <Skeleton className="w-40 h-8 md:w-48 md:h-9 lg:w-80 lg:h-12" />
        <Skeleton className="w-20 h-8 md:w-24 md:h-9 lg:w-40 lg:h-12" />
      </div>
    );
  }
  return (
    <div>
      <CustomH1 text={`${greeting}, ${name}! ${emoji}`} isPaddingEnabled />
    </div>
  );
}
