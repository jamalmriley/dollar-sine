"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/profile/Profile";
import CreateOrJoinOrg from "../components/organization/CreateOrJoinOrg";
import AddCourses from "./components/(3_courses)/AddCourses";
import FinishProfile from "../components/profile/FinishProfile";
import ProfileAlreadyCreated from "../components/profile/ProfileAlreadyCreated";
import { Prompt } from "@/types/general";

export default function TeacherOnboardingPage() {
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
    { id: "step-3", content: <AddCourses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
