"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/Profile";
import AdminFinishProfile from "./components/(1_profile)/AdminFinishProfile";
import AdminProfileAlreadyCreated from "./components/(1_profile)/AdminProfileAlreadyCreated";
import Organization from "./components/(2_org)/Organization";
import AddCourses from "./components/(3_courses)/AddCourses";

export default function AdminOnboardingPage() {
  const prompts = [
    {
      id: "step-1",
      content: (
        <Profile
          component1={<AdminFinishProfile />}
          component2={<AdminProfileAlreadyCreated />}
        />
      ),
    },
    {
      id: "step-2",
      content: <Organization />,
    },
    {
      id: "step-3",
      content: <AddCourses />,
    },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
