"use client";

import { Prompt } from "@/types/general";
import { JoinOrgCard } from "../components/organization/JoinOrg";
import OnboardingCarousel from "../components/OnboardingCarousel";
import Courses from "../components/courses/Courses";
import Profile from "../components/profile/Profile";

export default function GuardianOnboarding() {
  const prompts: Prompt[] = [
    { id: "step-1", content: <JoinOrgCard /> },
    { id: "step-2", content: <Profile /> },
    { id: "step-3", content: <Courses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
