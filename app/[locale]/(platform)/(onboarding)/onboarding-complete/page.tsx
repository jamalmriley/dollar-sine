import OnboardingContextProvider from "@/contexts/onboarding-context";
import AdminOnboardingComplete from "../onboarding/(admin)/components/(4_onboarding-complete)/AdminOnboardingComplete";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingCompletePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await currentUser();
  if (!user) redirect(`/sign-in?redirect_url=/${locale}/onboarding`);
  return (
    <OnboardingContextProvider>
      <div className="page-container">
        <AdminOnboardingComplete />
      </div>
    </OnboardingContextProvider>
  );
}
