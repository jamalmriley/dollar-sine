import StudentOnboardingPage from "./(student)/StudentOnboardingPage";
import GuardianOnboardingPage from "./(guardian)/GuardianOnboardingPage";
import TeacherOnboardingPage from "./(teacher)/TeacherOnboardingPage";
import AdminOnboardingPage from "./(admin)/AdminOnboardingPage";
import { currentUser } from "@clerk/nextjs/server";
import OnboardingContextProvider from "@/contexts/onboarding-context";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("Get started");

export default async function OnboardingPage() {
  const user = await currentUser();
  const role = user?.publicMetadata.role;

  if (!role) return;

  return (
    <div className="w-full h-full">
      <OnboardingContextProvider>
        {role === "student" && <StudentOnboardingPage />}
        {role === "guardian" && <GuardianOnboardingPage />}
        {role === "teacher" && <TeacherOnboardingPage />}
        {role === "admin" && <AdminOnboardingPage />}
        {/* {role === "admin" && <div className="page-container">admin</div>} */}
      </OnboardingContextProvider>
    </div>
  );
}
