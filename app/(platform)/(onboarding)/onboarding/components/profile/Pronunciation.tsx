"use client";

import {
  getPronunciations,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { StyledButton } from "@/components/StyledButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  if (!user || !isLoaded || !userMetadata) return;
  const pronunciationOptions: string[] = userMetadata.pronunciation
    ? [userMetadata.pronunciation, ...userMetadata.currPronunciationOptions]
    : userMetadata.currPronunciationOptions;
  return (
    <div className="size-full flex justify-between md:flex-col">
      {/* Header */}
      <div className="flex flex-col">
        <span
          className={`hidden md:block text-sm font-semibold ${
            pronunciation !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Tell us how to say your name.
        </span>
        <span className="h-full flex items-center text-xs font-medium text-muted-foreground md:h-fit md:mb-2">
          This will help others say <br className="block md:hidden" />
          your name correctly!
        </span>
      </div>

      {/* Pronounciation Options */}

      {/* Mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="block md:hidden">
          <StyledButton>
            {isLoading ? "Loading..." : pronunciation || "Choose"}
          </StyledButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <span key={i}>
                    <DropdownMenuItem>
                      <Skeleton className="size-full h-4" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </span>
                ))
            : pronunciationOptions.map((option, i) => (
                <span key={i}>
                  <DropdownMenuItem
                    className={`text-xs font-medium ${pronunciation === option ? "border border-default-color" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setPronunciation(option);
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </span>
              ))}
          <Button
            className="w-full flex items-center gap-2 text-xs"
            onClick={(e) => {
              e.preventDefault();
              getMorePronunciations();
            }}
            disabled={isLoading}
          >
            More options
            <FaArrowRotateRight />
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Desktop */}
      <span className="hidden md:block">
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
            {pronunciationOptions.map((option, i) => (
              <div key={i} className="whitespace-nowrap px-2">
                <button
                  className={`chip ${
                    option === pronunciation ? "border-default-color" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setPronunciation(option);
                  }}
                  disabled={isLoading}
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
      </span>
    </div>
  );
}
