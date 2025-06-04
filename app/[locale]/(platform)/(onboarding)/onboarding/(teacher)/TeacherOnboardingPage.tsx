"use client";

import OnboardingCarousel from "../components/OnboardingCarousel";
import Profile from "../components/Profile";
import TeacherFinishProfile from "./components/(1_profile)/TeacherFinishProfile";
import TeacherProfileAlreadyCreated from "./components/(1_profile)/TeacherProfileAlreadyCreated";
import CreateOrJoinOrg from "./components/(2_org)/CreateOrJoinOrg";
import AddCourses from "./components/(3_courses)/AddCourses";

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
    { id: "step-2", content: <CreateOrJoinOrg /> },
    { id: "step-3", content: <AddCourses /> },
  ];

  return <OnboardingCarousel prompts={prompts} />;
}
