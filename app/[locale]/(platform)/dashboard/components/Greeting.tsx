"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomH1 from "@/components/CustomH1";

export default function Greeting({
  name,
}: {
  name: String | null | undefined;
}) {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting =
    time.getHours() < 12
      ? "good-morning"
      : time.getHours() < 18
      ? "good-afternoon"
      : "good-evening";

  const emoji =
    time.getHours() < 12 ? "☀️" : time.getHours() < 18 ? "👋🏿" : "🌙";

  return (
    <div>
      <CustomH1 text={`${t(greeting)}, ${name}! ${emoji}`} isPaddingEnabled />
    </div>
  );
}
