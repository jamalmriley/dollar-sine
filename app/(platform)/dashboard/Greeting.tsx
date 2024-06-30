"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
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
      <h1 className="text-3xl md:text-5xl font-extrabold mb-5 select-none">
        {greeting}, student! {emoji}
      </h1>
    </div>
  );
}
