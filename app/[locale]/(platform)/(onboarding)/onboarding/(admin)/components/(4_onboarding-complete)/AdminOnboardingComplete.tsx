"use client";

import Receipt from "./Receipt";
import HighFive from "@/assets/svg/undraw_high-five_w86k.svg";
import Image from "next/image";
import Link from "next/link";
import { IOS_APP_LINK } from "@/utils/app";
import StyledButton from "@/components/StyledButton";
import { MdComputer, MdSmartphone } from "react-icons/md";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { format } from "date-fns";

// TODO: Put button that makes onboarding status set to done

export default function AdminOnboardingComplete() {
  const {
    transactionTotal,
    setTransactionTotal,
    transactionDate,
    setTransactionDate,
    transactionCode,
    setTransactionCode,
    isOnboardingComplete,
    setIsOnboardingComplete,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  const [paymentIntent] = useQueryState("payment_intent", {
    defaultValue: "",
  });

  useEffect(() => {
    const completeAdminOnboarding = async (
      userId: string | undefined,
      paymentIntent: string,
      locale: string
    ) => {
      if (!userId) return;
      function formatConfirmationCode(code: string): string {
        const strStart = 3;
        const strLength = 6;
        const first6Chars = code
          .substring(strStart, strStart + strLength)
          .toUpperCase();
        return `C-${first6Chars}`;
      }

      // Get transaction info from the payment intent.
      fetch(`/api/create-payment-intent?clientSecret=${paymentIntent}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          const paymentIntent = data.paymentIntent;
          setTransactionTotal(paymentIntent.amount);
          setTransactionDate(
            format(
              new Date(paymentIntent.created * 1000),
              "MM/dd/yyyy 'at' h:mm a"
              // , { locale: es } // TODO: Add locale functionality
            )
          );
          setTransactionCode(formatConfirmationCode(paymentIntent.id));
        });

      // Update the user's onboarding status to complete.
      // TODO: Add locale functionality
      fetch(`/api/onboarding-complete?user_id=${userId}&locale=${locale}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setIsOnboardingComplete(data.success);
        });
    };

    completeAdminOnboarding(user?.id, paymentIntent, "en");
  }, []);

  if (!user || !isLoaded || !isOnboardingComplete) return;
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
        <Link
          href={IOS_APP_LINK}
          target="_blank"
          className="flex justify-center items-center"
        >
          <StyledButton>
            <MdSmartphone />
            Download our app
          </StyledButton>
        </Link>

        <Link href="/dashboard" className="flex justify-center items-center">
          <StyledButton>
            <MdComputer />
            Go to dashboard
          </StyledButton>
        </Link>
      </div>
    </div>
  );
}
