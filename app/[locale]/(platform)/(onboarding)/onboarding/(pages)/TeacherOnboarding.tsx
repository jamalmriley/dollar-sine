"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/profile/Profile";
import CreateOrJoinOrg from "../components/organization/CreateOrJoinOrg";
import FinishProfile from "../components/profile/FinishProfile";
import ProfileAlreadyCreated from "../components/profile/ProfileAlreadyCreated";
import { Prompt } from "@/types/general";
import Courses from "../components/courses/Courses";

export default function TeacherOnboarding() {
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
