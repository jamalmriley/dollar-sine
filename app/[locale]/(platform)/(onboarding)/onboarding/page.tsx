import StudentOnboardingPage from "./(student)/StudentOnboardingPage";
import GuardianOnboardingPage from "./(guardian)/GuardianOnboardingPage";
import TeacherOnboardingPage from "./(teacher)/TeacherOnboardingPage";
import AdminOnboardingPage from "./(admin)/AdminOnboardingPage";
import { currentUser } from "@clerk/nextjs/server";
import OnboardingContextProvider from "@/contexts/onboarding-context";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";
import { UserMetadata } from "@/types/user";
import StyledButton from "@/components/StyledButton";
import GeneralErrorLogo from "@/assets/images/logos/dollar_sine/ds_logo_error_general.png";
import Image from "next/image";
import LoadingIndicator from "@/components/LoadingIndicator";

export const metadata: Metadata = setTitle("Get started");

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) return; // TODO: Redirect to sign-in

  const publicMetadata = user.publicMetadata as any as UserMetadata;
  const { role } = publicMetadata;

  if (typeof role !== "string") {
    return (
      <div className="page-container size-full flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  } else if (!role) {
    return (
      <div className="size-full page-container flex flex-col items-center gap-10">
        <Image src={GeneralErrorLogo} alt="Error" width={368} />
        <div className="max-w-[420px]">
          <h1 className="h2">There's an issue with your account.</h1>
          <h2 className="h3 mb-5">It's not you, {user.firstName}. It's us.</h2>
          <p>
            Something with your sign-up process went wrong. Try refreshing the
            page, and if the issue persists, please contact support.
          </p>
        </div>
        <div className="flex gap-10">
          <StyledButton onClick={async () => location.reload()}>
            Refresh page
          </StyledButton>

          {/* TODO */}
          <StyledButton onClick={() => {}}>Contact support</StyledButton>
        </div>
      </div>
    );
  }

  return (
    <OnboardingContextProvider>
      <div className="size-full">
        {role === "student" && <StudentOnboardingPage />}
        {role === "guardian" && <GuardianOnboardingPage />}
        {role === "teacher" && <TeacherOnboardingPage />}
        {role === "admin" && <AdminOnboardingPage />}
      </div>
    </OnboardingContextProvider>
  );
}
