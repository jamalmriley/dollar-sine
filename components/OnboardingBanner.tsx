"use client";

import { FaClipboardList } from "react-icons/fa";
import Banner from "./Banner";
import { useUser } from "@clerk/nextjs";

export default function OnboardingBanner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const isOnboardingCompleted = user?.publicMetadata
    .isOnboardingCompleted as boolean;
  const onboardingLink = user?.publicMetadata.onboardingLink as string;

  if (!isLoaded || !isSignedIn) return null;

  return (
    <Banner
      requiresSignIn={true}
      renderCondition={!isOnboardingCompleted}
      type="default"
      icon={<FaClipboardList className="w-full h-full" />}
      header="banner:onboarding-banner-header"
      text="banner:onboarding-banner-text"
      publishDate={new Date(0)}
      buttonText="banner:onboarding-banner-button"
      buttonHref={onboardingLink || "/onboarding"}
      renderExclusionList={["/onboarding"]}
    />
  );
}
