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
import { getUser, updateUserMetadata } from "@/app/actions/onboarding";
import { toast } from "@/hooks/use-toast";
import { UserMetadata } from "@/types/user";
import { User } from "@clerk/nextjs/server";
import { Prompt } from "@/types/general";

export default function OnboardingCarousel({ prompts }: { prompts: Prompt[] }) {
  const { user, isLoaded } = useUser();

  const pathname = usePathname();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const { lastUpdated, setCurrOnboardingStep } = useOnboardingContext();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [metadata, setMetadata] = useState<UserMetadata>(
    user?.publicMetadata as any as UserMetadata
  );

  // Save the onboarding progress once the user stops typing for at least 3 seconds.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isOnboardingCompleted = user?.publicMetadata.isOnboardingCompleted;
      if (user && !isOnboardingCompleted) {
        const onboardingLink = `/${locale}${pathname}${
          searchParams.toString() !== "" ? "?" + searchParams.toString() : ""
        }`;
        const metadata = { onboardingLink } as UserMetadata;

        const saveOnboardingProgress = async () => {
          const res = await updateUserMetadata(user.id, metadata);

          toast({
            variant: res.success ? "default" : "destructive",
            title: res.success
              ? "Onboarding progress saved ✅"
              : res.message?.title,
            description: res.success
              ? "You can now refresh or exit the page if needed."
              : res.message?.description,
          });
        };

        saveOnboardingProgress();
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

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
    });
  }, [api]);

  // Update the user's metadata upon completion of each onboarding step to ensure that buttons work.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
        setMetadata(publicMetadata);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [lastUpdated]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (!user || !isLoaded) return;

  return (
    <div className="h-full flex flex-col justify-between items-center pt-10">
      {/* Carousel */}
      <Carousel setApi={setApi} opts={{ watchDrag: false }} className="w-full flex grow">
        <CarouselContent>
          {prompts.map((prompt) => (
            <CarouselItem
              key={prompt.id}
              className={`max-h-[36rem] flex justify-center`}
            >
              {prompt.content}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Buttons and Indicators */}
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
                ? "w-5 bg-emerald-400"
                : "w-2 bg-muted-foreground/30"
            } h-2 rounded-full`}
          />
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={scrollNext}
          disabled={
            !metadata ||
            current === count ||
            !Boolean(metadata.lastOnboardingStepCompleted >= current)
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
    </div>
  );
}
