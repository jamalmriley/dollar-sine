"use client";

import Receipt from "./Receipt";
import HighFive from "@/assets/svg/undraw_high-five_w86k.svg";
import Image from "next/image";
import Link from "next/link";
import { IOS_APP_LINK } from "@/utils/app";
import StyledButton from "@/components/StyledButton";
import { MdComputer, MdSmartphone } from "react-icons/md";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { completeOnboardingProgress } from "@/utils/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";

// TODO: Put button that makes onboarding status set to done

export default function AdminOnboardingComplete() {
  const {
    transactionTotal,
    transactionDate,
    transactionCode,
    isOnboardingComplete,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  if (!user || !isLoaded) return;

  const [paymentIntent] = useQueryState("payment_intent", {
    defaultValue: "",
  });

  useEffect(() => {
    completeOnboardingProgress(user.id, paymentIntent);
  }, []);

  if (!isOnboardingComplete) return;
  return (
    <div className="size-full flex flex-col justify-between items-center">
      <h1 className="h1 text-center">Your onboarding is complete!</h1>

      {/* SVG and Receipt */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-5 md:gap-20">
        {/* SVG Image */}
        <Image
          src={HighFive}
          alt="Onboarding completed"
          className="object-contain max-w-48 md:max-w-xs lg:max-w-lg hidden md:block"
        />

        {/* Component */}
        <div className="h-96">
          <Receipt
            transactionTotal={transactionTotal}
            transactionDate={transactionDate}
            transactionCode={transactionCode}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row md:justify-around gap-5 md:gap-20 mb-1">
        <StyledButton>
          <Link
            href={IOS_APP_LINK}
            target="_blank"
            className="flex justify-center items-center gap-2"
          >
            <MdSmartphone />
            Download our app
          </Link>
        </StyledButton>

        <StyledButton>
          <Link
            href="/dashboard"
            className="flex justify-center items-center gap-2"
          >
            <MdComputer />
            Go to dashboard
          </Link>
        </StyledButton>
      </div>
    </div>
  );
}
