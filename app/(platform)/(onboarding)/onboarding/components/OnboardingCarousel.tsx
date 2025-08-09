"use client";

import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { updateUserMetadata } from "@/app/actions/onboarding";
import { UserMetadata } from "@/types/user";
import { Prompt } from "@/types/general";
import { useUserData } from "@/hooks/use-userData";
import { useResetQueryState } from "@/hooks/use-resetQueryState";
import { Loader2 } from "lucide-react";
import { BsCloudCheck } from "react-icons/bs";

export default function OnboardingCarousel({ prompts }: { prompts: Prompt[] }) {
  const { userMetadata, lastUpdated, setCurrOnboardingStep } =
    useOnboardingContext();
  const pathname = usePathname();
  const { locale } = useParams();
  const { reset } = useResetQueryState();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [isSavingProgress, setIsSavingProgress] = useState<boolean>(false);

  // Save the onboarding progress once the user stops typing for at least 3 seconds.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const metadata = user?.publicMetadata as unknown as UserMetadata;
      if (user?.id && !metadata.isOnboardingComplete) {
        const onboardingLink = `/${locale}${pathname}${
          searchParams.toString() !== "" ? "?" + searchParams.toString() : ""
        }`;
        const metadata = { onboardingLink } as UserMetadata;

        const saveOnboardingProgress = async () => {
          await setIsSavingProgress(true);
          await updateUserMetadata(user.id, metadata).then((res) => {
            if (!res.success) console.error(res.message);
            setIsSavingProgress(false);
          });
        };

        saveOnboardingProgress();
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [locale, pathname, searchParams, user?.id]);

  // Maintain the state of the custom carousel.
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);

    const initValue = localStorage.getItem("onboardingStep");
    if (initValue) {
      api.scrollTo(parseInt(initValue) - 1, true); // 0-based index
      setCurrent(parseInt(initValue)); // 1-based index
      setCurrOnboardingStep({
        step: parseInt(initValue),
        isEditing: false,
      });
    } else {
      setCurrent(api.selectedScrollSnap() + 1);
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCurrOnboardingStep({
        step: api.selectedScrollSnap() + 1,
        isEditing: false,
      });
      localStorage.setItem(
        "onboardingStep",
        String(api.selectedScrollSnap() + 1)
      );
      reset();
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useUserData(lastUpdated);
  if (!user || !isLoaded || !userMetadata) return;
  return (
    <div className="h-full flex flex-col justify-between items-center pt-10">
      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{ watchDrag: false }}
        className="w-full flex grow"
      >
        <CarouselContent>
          {prompts.map((prompt) => (
            <CarouselItem key={prompt.id} className="flex justify-center">
              {prompt.content}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Buttons and Carousel Item Indicators */}
      <div className="flex gap-5 items-center py-5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={scrollPrev}
          disabled={current === 1}
        >
          <FaArrowLeft />
        </Button>
        {prompts.map((_, i) => (
          <div
            key={i}
            className={`transform ease-out duration-500 ${
              i + 1 === current
                ? "w-5 bg-emerald-400 border border-default-color"
                : "w-2 bg-muted-foreground/30 border border-muted-foreground/30"
            } h-2 rounded-full`}
          />
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={scrollNext}
          disabled={
            !userMetadata ||
            current === count ||
            !Boolean(userMetadata.lastOnboardingStepCompleted >= current)
          }
        >
          <FaArrowRight />
        </Button>
      </div>

      {/* Progress Bar*/}
      <Progress
        value={((current - 1) / count) * 100}
        className="h-2 rounded-none"
      />

      {/* Saving Indictor */}
      <div className="absolute bottom-5 right-5 text-xs italic text-muted-foreground select-none">
        {isSavingProgress ? (
          <span className="flex gap-2.5 items-center">
            <span>Saving...</span>
            <Loader2 className="size-5 animate-spin" />
          </span>
        ) : (
          <span className="flex gap-2.5 items-center">
            <span>Progress saved</span>
            <BsCloudCheck className="size-5" />
          </span>
        )}
      </div>
    </div>
  );
}
