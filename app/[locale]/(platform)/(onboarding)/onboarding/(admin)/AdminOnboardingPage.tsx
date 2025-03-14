"use client";

import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Organization from "./components/(2_create-org)/Organization";
import AddCourses from "./components/(3_add-courses)/AddCourses";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Profile from "./components/(1_finish-profile-setup)/Profile";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { updateUserMetadata } from "@/app/actions/onboarding";
import { toast } from "@/hooks/use-toast";
import { AdminMetadata } from "@/types/user";

export default function AdminOnboardingPage() {
  const { user, isLoaded } = useUser();

  const pathname = usePathname();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const { setIsUpdatingProfile, setIsUpdatingOrg, setCurrOnboardingStep } =
    useOnboardingContext();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  // Save the onboarding progress once the user stops typing for at least 3 seconds.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isOnboardingCompleted = user?.publicMetadata.isOnboardingCompleted;
      if (user && !isOnboardingCompleted) {
        const onboardingLink = `/${locale}${pathname}${
          searchParams.toString() !== "" ? "?" + searchParams.toString() : ""
        }`;
        const metadata = { onboardingLink } as AdminMetadata;

        const saveOnboardingProgress = async () => {
          const res = await updateUserMetadata(user.id, metadata);

          toast({
            variant: res.success ? "default" : "destructive",
            title: res.message?.title,
            description: res.message?.description,
          });
        };

        saveOnboardingProgress();
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  // Determine the state of the carousel components based on the search params.
  useEffect(() => {
    const profileParams = [
      "prefix",
      "displayName",
      "displayNameFormat",
      "jobTitle",
      "pronouns",
      "skinTone",
    ];
    const orgParams = ["orgName", "orgAddress", "orgSlug", "is2FARequired"];

    const searchParamKeys = searchParams.keys().toArray();

    if (searchParamKeys.length === 0) return;
    for (const key of searchParamKeys) {
      if (profileParams.indexOf(key) !== -1) setIsUpdatingProfile(true);
      if (orgParams.indexOf(key) !== -1) setIsUpdatingOrg(true);
    }
  }, [searchParams]);

  // Maintain the state of the custom carousel.
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);

    const initValue = localStorage.getItem("onboardingStep");
    if (initValue) {
      api.scrollTo(parseInt(initValue) - 1, true); // 0-based index
      setCurrent(parseInt(initValue)); // 1-based index
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

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (!user || !isLoaded) return;

  const metadata = user.publicMetadata as any as AdminMetadata;
  const prompts = [
    {
      id: "step-1",
      content: <Profile />,
      isCompleted: metadata.lastOnboardingStepCompleted >= 1,
    },
    {
      id: "step-2",
      content: <Organization />,
      isCompleted: metadata.lastOnboardingStepCompleted >= 2,
    },
    {
      id: "step-3",
      content: <AddCourses />,
      isCompleted: false,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between items-center pt-10">
      {/* Carousel */}
      <Carousel setApi={setApi} opts={{ watchDrag: false }} className="w-full">
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
      <div className="flex gap-5 items-center mt-5">
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
          // <Link to={`#${_.id}`}>
          <div
            key={i}
            className={`transform ease-out duration-500 ${
              i + 1 === current
                ? "w-5 bg-emerald-400"
                : "w-2 bg-muted-foreground/30"
            } h-2 rounded-full`}
          />
          // </Link>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={scrollNext}
          disabled={
            !metadata || current === count || !prompts[current - 1].isCompleted
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
