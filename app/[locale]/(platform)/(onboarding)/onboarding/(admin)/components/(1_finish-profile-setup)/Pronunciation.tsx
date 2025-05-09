"use client";

import {
  getPronunciations,
  getUser,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { getUniqueArr } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { FaArrowRotateRight } from "react-icons/fa6";

export default function Pronunciation() {
  const { user, isLoaded } = useUser();
  const [pronunciation, setPronunciation] = useQueryState("pronunciation", {
    defaultValue: "",
  });
  const { isLoading, setIsLoading } = useOnboardingContext();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [userData, setUserData] = useState<User>();
  const metadata = userData?.publicMetadata as any as UserMetadata;

  async function getMorePronunciations() {
    if (!user) return;

    setLastUpdated(new Date().toString());
    await getPronunciations(
      String(user.fullName),
      metadata.currPronunciationOptions
    )
      .then((res) => {
        const [prev, curr] = [
          metadata.currPronunciationOptions,
          res.data.split(", "),
        ];

        const prevPronunciationOptions = getUniqueArr([
          ...metadata.prevPronunciationOptions,
          ...prev,
        ]); // Updates the previous pronunciation options with the newly added options while ensuring uniqueness (i.e. no duplicate values)

        updateUserMetadata(user.id, {
          ...metadata,
          currPronunciationOptions: curr,
          prevPronunciationOptions,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    const fetchAndSetUser = async () => {
      setIsLoading(true);
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;

        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetUser();
  }, [lastUpdated]);

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
        <div>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="inline-flex p-2">
                <Skeleton className="w-32 h-[26px] rounded-full hover:scale-110 transform transition ease-in-out inline-flex gap-2" />
              </span>
            ))}
        </div>
      ) : metadata ? (
        <div>
          {metadata.currPronunciationOptions.map((option, i) => (
            <div key={i} className="inline-flex p-2">
              <button
                className={`chip ${
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

          <span className="inline-flex p-2">
            <button
              className={`chip flex items-center gap-2 ${
                pronunciation === "none" ? "border-default-color" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                getMorePronunciations();
              }}
            >
              More options
              <FaArrowRotateRight />
            </button>
          </span>
        </div>
      ) : (
        "Unknown error occurred."
      )}
    </div>
  );
}
