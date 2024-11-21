"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { IoMdClose } from "react-icons/io";
import { CiBullhorn } from "react-icons/ci";

export default function Banner({
  header,
  text,
  publishDate,
}: {
  header?: string;
  text: string;
  publishDate: Date;
}) {
  let value;
  if (typeof window !== "undefined") {
    value = localStorage.getItem("lastConfirmationDate") || "";
  }
  const [now, setNow] = useState(new Date());
  const [lastConfirmationDate, setLastConfirmationDate] = useState(
    value || now.toUTCString()
  );
  const saveToLocalStorage = () => {
    const newVal = new Date().toUTCString();
    localStorage.setItem("lastConfirmationDate", newVal);
    setLastConfirmationDate(newVal);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/*
      The banner will display under the following conditions:

      (The user last pressed the "X" button before the most recent message's publish date.
      OR  (||)
      The user has never pressed the "X" button.)
      AND (&&)
      (The publish date has passed.)
      */}
      {((lastConfirmationDate === undefined
        ? new Date()
        : new Date(lastConfirmationDate) <= publishDate) ||
        value === "") &&
        now >= publishDate && (
          <div className="flex justify-between items-center w-full h-20 px-10 py-5 bg-emerald-50 dark:bg-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center">
                <CiBullhorn className="w-5 h-5 text-emerald-50 dark:text-emerald-950" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                  {header}
                </span>
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-100">
                  {text}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-full min-w-7 w-7 h-7"
              onClick={() => saveToLocalStorage()}
            >
              <IoMdClose />
            </Button>
          </div>
        )}
    </>
  );
}
