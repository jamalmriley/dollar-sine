"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { IoMdClose } from "react-icons/io";

export default function Banner({
  text = "An example banner message would go here. 👋🏿",
  publishDate,
}: {
  text: string;
  publishDate: Date;
}) {
  // const [now, setNow] = useState(new Date());
  // let value;
  // if (typeof window !== "undefined") {
  //   value = localStorage.getItem("lastConfirmationDate") || "";
  // }
  // const [lastConfirmationDate, setLastConfirmationDate] = useState(
  //   value || now.toUTCString()
  // );
  // const saveToLocalStorage = () => {
  //   const newVal = new Date().toUTCString();
  //   localStorage.setItem("lastConfirmationDate", newVal);
  //   setLastConfirmationDate(newVal);
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNow(new Date());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

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
      {/* {((lastConfirmationDate === undefined
        ? new Date()
        : new Date(lastConfirmationDate) <= publishDate) ||
        value === "") &&
        now >= publishDate && ( */}
      <div className="flex justify-between items-center w-full h-10 px-10 py-5 bg-primary text-white">
        <span className="text-xs font-bold">{text}</span>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="rounded-full min-w-7 w-7 h-7"
          // onClick={() => saveToLocalStorage()}
        >
          <IoMdClose />
        </Button>
      </div>
      {/* )} */}
    </>
  );
}
