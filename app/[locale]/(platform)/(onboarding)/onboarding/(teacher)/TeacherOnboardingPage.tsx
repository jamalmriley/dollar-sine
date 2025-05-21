"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/Profile";
import TeacherFinishProfile from "./components/(1_profile)/TeacherFinishProfile";
import TeacherProfileAlreadyCreated from "./components/(1_profile)/TeacherProfileAlreadyCreated";

export default function TeacherOnboardingPage() {
  const prompts = [
    {
      id: "step-1",
      content: (
        <Profile
          component1={<TeacherFinishProfile />}
          component2={<TeacherProfileAlreadyCreated />}
        />
      ),
    },
    {
      id: "step-2",
      content: <>org stuff</>,
    },
    {
      id: "step-3",
      content: (
        <>
          course stuff. maybe make admin grant teachers permission to buy stuff
        </>
      ),
    },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
