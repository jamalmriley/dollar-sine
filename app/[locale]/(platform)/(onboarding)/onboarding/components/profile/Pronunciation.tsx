"use client";

import {
  getPronunciations,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { getUniqueArr } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { useQueryState } from "nuqs";
import { FaArrowRotateRight } from "react-icons/fa6";

export default function Pronunciation() {
  const { userMetadata, isLoading, setIsLoading, setLastUpdated } =
    useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [pronunciation, setPronunciation] = useQueryState("pronunciation", {
    defaultValue: "",
  });

  async function getMorePronunciations() {
    if (!user || !userMetadata) return;

    await setIsLoading(true);
    await getPronunciations(
      String(user.fullName),
      userMetadata.currPronunciationOptions
    )
      .then((res) => {
        const [prev, curr] = [
          userMetadata.currPronunciationOptions,
          res.data.split(", "),
        ];

        const prevPronunciationOptions = getUniqueArr([
          ...userMetadata.prevPronunciationOptions,
          ...prev,
        ]); // Updates the previous pronunciation options with the newly added options while ensuring uniqueness (i.e. no duplicate values)

        updateUserMetadata(user.id, {
          ...userMetadata,
          currPronunciationOptions: curr,
          prevPronunciationOptions,
        }).then(() => setLastUpdated(new Date().toString()));
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

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
        <div className="h-12 flex items-center overflow-x-scroll scrollbar-custom">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="inline-flex p-2">
                <Skeleton className="w-32 h-[26px] rounded-full hover:scale-110 transform transition ease-in-out inline-flex gap-2" />
              </span>
            ))}
        </div>
      ) : userMetadata ? (
        <div className="h-12 flex items-center overflow-x-scroll scrollbar-custom">
          {userMetadata.currPronunciationOptions.map((option, i) => (
            <div key={i} className="whitespace-nowrap px-2">
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

          <span className="whitespace-nowrap px-2">
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
