import { Role } from "@/app/api/users/route";
import React from "react";
import StudentOnboardingPage from "./(student)/StudentOnboardingPage";
import GuardianOnboardingPage from "./(guardian)/GuardianOnboardingPage";
import TeacherOnboardingPage from "./(teacher)/TeacherOnboardingPage";
import AdminOnboardingPage from "./(admin)/AdminOnboardingPage";

export default function OnboardingPage() {
  // let role: Role = "admin";
  let role;
  if (!role) return;

  return (
    <div>
      {role === "student" && <StudentOnboardingPage />}
      {role === "guardian" && <GuardianOnboardingPage />}
      {role === "teacher" && <TeacherOnboardingPage />}
      {role === "admin" && <AdminOnboardingPage />}
    </div>
  );
}
