"use client";

import { Prompt } from "@/types/general";
import { JoinOrgCard } from "../components/organization/JoinOrg";
import OnboardingCarousel from "../components/OnboardingCarousel";
import Courses from "../components/courses/Courses";

export default function GuardianOnboarding() {
  const prompts: Prompt[] = [
    { id: "step-1", content: <JoinOrgCard /> },
    { id: "step-3", content: <Courses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
