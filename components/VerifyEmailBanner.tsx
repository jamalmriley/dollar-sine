"use client";

import { MdAlternateEmail } from "react-icons/md";
import Banner from "./Banner";
import { useUser } from "@clerk/nextjs";

export default function VerifyEmailBanner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hasVerifiedEmailAddress = user?.hasVerifiedEmailAddress;

  if (!isLoaded || !isSignedIn) return null;

  function sendConfirmationEmail() {
    console.log("Confirmation email sent!");
  }

  return (
    <Banner
      requiresSignIn={true}
      // renderCondition={!hasVerifiedEmailAddress}
      renderCondition={hasVerifiedEmailAddress} // Use this until sendConfirmationEmail function is created and works.
      type="warning"
      icon={<MdAlternateEmail className="w-full h-full" />}
      header="banner:verify-email-banner-header"
      text="banner:verify-email-banner-text"
      publishDate={new Date(0)}
      buttonText="banner:verify-email-banner-button"
      buttonAction={() => sendConfirmationEmail()}
    />
  );
}
