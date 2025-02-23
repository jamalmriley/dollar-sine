import OnboardingContextProvider from "@/contexts/onboarding-context";
import AdminOnboardingComplete from "../onboarding/(admin)/components/(4_onboarding-complete)/AdminOnboardingComplete";

export default function OnboardingComplete() {
  return (
    <OnboardingContextProvider>
      <div className="page-container">
        <AdminOnboardingComplete />
      </div>
    </OnboardingContextProvider>
  );
}
