"use client";

import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Organization, {
  isCreateOrgCompleted,
} from "./components/(2_create-org)/Organization";
import AddCourses from "./components/(3_add-courses)/AddCourses";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { saveOnboardingProgress } from "@/utils/onboarding";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useActiveUserContext } from "@/contexts/active-user-context";
import FeaturesBentoGrid from "./components/(4_onboarding-complete)/FeaturesBentoGrid";
import Profile, {
  isFinishProfileSetupCompleted,
} from "./components/(1_finish-profile-setup)/Profile";

export default function AdminOnboardingPage() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const { hasClickedOrTyped } = useActiveUserContext();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const prompts = [
    {
      id: "step-1",
      content: <Profile />,
      title: "Finish setting up your profile.",
      basis: "basis-full",
      isCompleted: isFinishProfileSetupCompleted(),
    },
    {
      id: "step-2",
      content: <Organization />,
      title: "Create your organization.",
      basis: "basis-full",
      isCompleted: isCreateOrgCompleted(),
    },
    {
      id: "step-3",
      content: <AddCourses />,
      title: "Browse and add courses.",
      basis: "basis-full",
      isCompleted: true,
    },
  ];

  // Save the onboarding progress once the user stops typing for at least 3 seconds.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const userId = user?.id;
      if (hasClickedOrTyped && userId) {
        const fullPathname = `/${
          params.locale
        }${pathname}?${searchParams.toString()}`;
        const alteredFullPathname = fullPathname.replaceAll("&", ">"); // Replaces "&" with ">" so that the full pathname is saved to the user's metadata.
        // console.log(fullPathname);
        saveOnboardingProgress(userId, alteredFullPathname);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  // Maintain the state of the custom carousel.
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (!user || !isLoaded) return;
  return (
    <>
      {/* TODO: If onboarding is fully complete, display FeaturesBentoGrid */}
      {1 + 1 === 2 ? (
        <div className="h-full flex flex-col justify-between items-center pt-10">
          {/* Carousel */}
          <Carousel
            setApi={setApi}
            opts={{ watchDrag: false }}
            className="w-full"
          >
            <CarouselContent>
              {prompts.map((prompt, index) => (
                <CarouselItem
                  key={index}
                  className={`max-h-[36rem] flex justify-center ${prompt.basis}`}
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
              disabled={current === count || !prompts[current - 1].isCompleted}
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
      ) : (
        <div className="page-container flex justify-center items-center">
          <FeaturesBentoGrid />
        </div>
      )}
    </>
  );
}

//  {/* Checklist */}
//           {/* <div className="w-72 min-w-72 flex flex-col items-center border rounded-lg p-5">
//           <span className="text-lg font-bold">Onboarding Checklist</span>
//           {prompts.map((prompt, i) => (
//             <div
//               key={i}
//               className={`w-full h-8 flex items-center gap-3 ${
//                 i + 1 < current && "text-muted-foreground line-through"
//               }`}
//             >
//               {/* Checkbox *-/}
//               <div className="h-full flex flex-col items-center">
//                 <Separator
//                   decorative
//                   orientation="vertical"
//                   className={`h-2 ${i === 0 && "bg-transparent"}`}
//                 />
//                 <div className="size-4">
//                   {i + 1 < current ? (
//                     <FaCheckCircle className="size-full" />
//                   ) : (
//                     <div
//                       className={`size-full rounded-full ${
//                         i + 1 === current ? "border-2" : "border"
//                       }`}
//                     />
//                   )}
//                 </div>
//                 <Separator
//                   decorative
//                   orientation="vertical"
//                   className={`h-2 ${
//                     i === prompts.length - 1 && "bg-transparent"
//                   }`}
//                 />
//               </div>
//               <span
//                 className={`text-sm ${
//                   i + 1 === current ? "font-bold" : "font-medium"
//                 }`}
//               >
//                 {prompt.title}
//               </span>
//             </div>
//           ))}
//         </div> */}
