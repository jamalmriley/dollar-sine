"use client";

import { getPronunciations } from "@/app/actions/onboarding";
import { useUser } from "@clerk/nextjs";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function Pronunciation() {
  const { user, isLoaded } = useUser();
  const [pronunciation, setPronunciation] = useQueryState("pronunciation", {
    defaultValue: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<string[] | undefined>();

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      await getPronunciations(String(user?.fullName)).then((res) => {
        setOptions(res.data.split(", "));
        setIsLoading(false);
      });
    })();
  }, []);

  if (!user || !isLoaded) return;
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="hidden md:flex flex-col">
        <span
          className={`text-sm font-semibold ${
            pronunciation !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Tell us how to say your name.
        </span>
        <span className="text-xs font-medium text-muted-foreground mb-2">
          This will help others say your name correctly!
        </span>
      </div>
      {/* Pronounciation Options */}
      {isLoading ? (
        "Loading pronunciations..."
      ) : options ? (
        <div>
          {options.map((option, i) => (
            <div key={i} className="inline-block p-2">
              <button
                className={`chip inline-flex gap-2 ${
                  option === pronunciation ? "border-default-color" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setPronunciation(option);
                }}
              >
                {option}
              </button>
            </div>
          ))}

          <span className="inline-block p-2">
            <button
              className={`chip inline-flex gap-2 ${
                pronunciation === "none" ? "border-default-color" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              More options
            </button>
          </span>
        </div>
      ) : (
        "try again"
      )}
    </div>
  );
}
