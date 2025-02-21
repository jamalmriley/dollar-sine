import OnboardingContextProvider from "@/contexts/onboarding-context";
import AdminOnboardingComplete from "../onboarding/(admin)/components/(4_onboarding-complete)/AdminOnboardingComplete";

export default function OnboardingComplete() {
  return (
    <div className="page-container">
      <OnboardingContextProvider>
        <AdminOnboardingComplete />
      </OnboardingContextProvider>
    </div>
  );
}
