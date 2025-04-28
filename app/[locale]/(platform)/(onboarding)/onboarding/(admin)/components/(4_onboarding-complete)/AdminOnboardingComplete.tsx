"use client";

import Receipt, { handleConfetti } from "./Receipt";
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
import {
  getOrganization,
  updateOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { AdminMetadata, OrganizationMetadata } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import { getPaymentIntent } from "@/app/actions/payment";
import Stripe from "stripe";
import { SelectedCourse } from "@/types/course";
import { Organization } from "@clerk/nextjs/server";

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

  let selectedCourses: SelectedCourse[];

  useEffect(() => {
    const formatConfirmationCode = (code: string): string => {
      const strStart = 3;
      const strLength = 6;
      const first6Chars = code
        .substring(strStart, strStart + strLength)
        .toUpperCase();
      return `C-${first6Chars}`;
    };

    const completeAdminOnboarding = async (
      userId: string | undefined,
      paymentIntent: string,
      locale: string
    ) => {
      if (!userId) return;

      // Get transaction info from the payment intent.
      const paymentIntentDetails = await getPaymentIntent(paymentIntent).then(
        (res) => {
          return res.data as Stripe.Response<Stripe.PaymentIntent>;
        }
      );

      if (paymentIntentDetails) {
        const metadata = paymentIntentDetails.metadata;
        selectedCourses = JSON.parse(
          metadata.courses
        ) as any as SelectedCourse[];
        setTransactionTotal(paymentIntentDetails.amount);
        setTransactionDate(
          format(
            new Date(paymentIntentDetails.created * 1000),
            "MM/dd/yyyy 'at' h:mm a"
            // { locale } // TODO: Add locale functionality
          )
        );
        setTransactionCode(formatConfirmationCode(paymentIntentDetails.id));
      }

      // Update the user's onboarding status to complete.
      // TODO: Add locale functionality
      const publicMetadata = user?.publicMetadata as any as AdminMetadata;
      const {
        role,
        pronunciation,
        currPronunciationOptions,
        prevPronunciationOptions,
        pronouns,
        emojiSkinTone,
        organizations,
        classes,
      } = publicMetadata;

      const userMetadata: AdminMetadata = {
        role,
        pronunciation,
        currPronunciationOptions,
        prevPronunciationOptions,
        isOnboardingCompleted: true,
        lastOnboardingStepCompleted: 3,
        onboardingLink: `/${locale}/onboarding`,
        pronouns,
        emojiSkinTone,
        organizations,
        courses: selectedCourses,
        classes,
      };

      await updateUserMetadata(userId, userMetadata).then(() => {
        const orgId = user?.organizationMemberships[0].organization
          .id as string;

        getOrganization(orgId).then((res) => {
          const organization = JSON.parse(res.data) as Organization;
          const orgMetadata =
            organization.publicMetadata as any as OrganizationMetadata;
          const newOrgMetadata: OrganizationMetadata = {
            ...orgMetadata,
            courses: selectedCourses,
          };

          updateOrganization(orgId, newOrgMetadata).then((res) => {
            setIsOnboardingComplete(res.success);
            toast({
              variant: res.success ? "default" : "destructive",
              title: "Welcome to Dollar Sine! 🤓",
              description: res.success
                ? "Your onboarding is now complete."
                : res.message?.description,
            });

            handleConfetti();
            localStorage.setItem("onboardingStep", "1"); // Sets the onboarding step to 1 in case a future user signs up on the same device.
          });
        });
      });
    };

    completeAdminOnboarding(user?.id, paymentIntent, "en");
  }, [isLoaded]);

  // TODO: Send digital receipt via Resend
  // TODO: Create downloadable PDF receipt
  // TODO: Add shortened and full confirmation codes to selectedCourse

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
