import { currentUser } from "@clerk/nextjs/server";
import OnboardingContextProvider from "@/contexts/onboarding-context";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";
import { UserMetadata } from "@/types/user";
import { StyledButton } from "@/components/StyledButtons";
import GeneralErrorLogo from "@/assets/images/dollar_sine/ds_logo_error_general.png";
import Image from "next/image";
import LoadingIndicator from "@/components/LoadingIndicator";
import { redirect } from "next/navigation";
import TeacherOnboarding from "./(roles)/TeacherOnboarding";
import AdminOnboarding from "./(roles)/AdminOnboarding";
import GuardianOnboarding from "./(roles)/GuardianOnboarding";
import StudentOnboarding from "./(roles)/(student)/StudentOnboarding";

export const metadata: Metadata = setTitle("Get started");

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/onboarding");

  const publicMetadata = user.publicMetadata as unknown as UserMetadata;
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
          <h1 className="h2">There&apos;s an issue with your account.</h1>
          <h2 className="h3 mb-5">
            It&apos;s not you, {user.firstName}. It&apos;s us.
          </h2>
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
        {role === "admin" && <AdminOnboarding />}
        {role === "teacher" && <TeacherOnboarding />}
        {role === "guardian" && <GuardianOnboarding />}
        {role === "student" && <StudentOnboarding />}
      </div>
    </OnboardingContextProvider>
  );
}
