"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/profile/Profile";
import Courses from "../components/courses/Courses";
import FinishProfile from "../components/profile/FinishProfile";
import ProfileAlreadyCreated from "../components/profile/ProfileAlreadyCreated";
import CreateOrJoinOrg from "../components/organization/CreateOrJoinOrg";
import { Prompt } from "@/types/general";

export default function AdminOnboarding() {
  const prompts: Prompt[] = [
    {
      id: "step-1",
      content: (
        <Profile
          component1={<FinishProfile />}
          component2={<ProfileAlreadyCreated />}
        />
      ),
    },
    { id: "step-2", content: <CreateOrJoinOrg /> },
    { id: "step-3", content: <Courses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
