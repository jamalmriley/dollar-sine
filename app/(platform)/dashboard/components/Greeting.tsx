"use client";

import CustomH1 from "@/components/CustomH1";
import { useEffect, useState } from "react";

export default function Greeting({
  name,
}: {
  name: String | null | undefined;
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
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

  return (
    <div>
      <CustomH1 text={`${greeting}, ${name}! ${emoji}`} isPaddingEnabled />
    </div>
  );
}
