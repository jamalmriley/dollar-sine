"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/profile/Profile";
import Courses from "../components/courses/Courses";
import CreateOrJoinOrg from "../components/organization/CreateOrJoinOrg";
import { Prompt } from "@/types/general";

export default function TeacherOnboarding() {
  const prompts: Prompt[] = [
    { id: "step-1", content: <Profile /> },
    { id: "step-2", content: <CreateOrJoinOrg /> },
    { id: "step-3", content: <Courses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
