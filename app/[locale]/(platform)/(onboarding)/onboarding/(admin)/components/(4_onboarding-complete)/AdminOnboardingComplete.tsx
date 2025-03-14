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
import { updateUserMetadata } from "@/app/actions/onboarding";
import { AdminMetadata } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import { getPaymentIntent } from "@/app/actions/payment";

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
      await getPaymentIntent(paymentIntent).then((res) => {
        const paymentIntent = res.data;
        if (paymentIntent) {
          setTransactionTotal(paymentIntent.amount);
          setTransactionDate(
            format(
              new Date(paymentIntent.created * 1000),
              "MM/dd/yyyy 'at' h:mm a"
              // , { locale: es } // TODO: Add locale functionality
            )
          );
          setTransactionCode(formatConfirmationCode(paymentIntent.id));
        }
      });

      // Update the user's onboarding status to complete.
      // TODO: Add locale functionality
      const metadata = {
        isOnboardingCompleted: true,
        onboardingLink: "/onboarding",
        // courses: [] // TODO
      } as AdminMetadata;

      await updateUserMetadata(userId, metadata).then((res) => {
        setIsOnboardingComplete(res.success);
        toast({
          variant: res.success ? "default" : "destructive",
          title: res.message?.title,
          description: res.message?.description,
        });
      });
    };

    completeAdminOnboarding(user?.id, paymentIntent, "en");
  });

  // TODO: Add confetti effect
  // TODO: Send digital receipt via Resend
  // TODO: Create downloadable PDF receipt
  // TODO: Add course to user and to org (see line 74)

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
