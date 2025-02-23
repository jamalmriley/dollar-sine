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

  if (!role)
    return <h1 className="h1 my-0 mx-auto">This user's role is not found.</h1>;

  return (
    <OnboardingContextProvider>
      <div className="w-full h-full">
        {role === "student" && <StudentOnboardingPage />}
        {role === "guardian" && <GuardianOnboardingPage />}
        {role === "teacher" && <TeacherOnboardingPage />}
        {role === "admin" && <AdminOnboardingPage />}
      </div>
    </OnboardingContextProvider>
  );
}
