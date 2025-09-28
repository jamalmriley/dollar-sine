"use client";

import Receipt from "@/components/Receipt";
import WomanHoldingHeart from "@/assets/svg/undraw_love-it_8pc0.svg";
import ThankYouLightOutlined from "@/assets/images/thank-you-light-outlined.png";
import ThankYouLightFilled from "@/assets/images/thank-you-light-filled.png";
import ThankYouDarkOutlined from "@/assets/images/thank-you-dark-outlined.png";
import ThankYouDarkFilled from "@/assets/images/thank-you-dark-filled.png";
import Image from "next/image";
import Link from "next/link";
import { StyledButton } from "@/components/StyledButton";
import { MdComputer } from "react-icons/md";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { format } from "date-fns";
import {
  getOrganizationById,
  updateOrganization,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { OrganizationMetadata, UserMetadata } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import { getPaymentIntent } from "@/app/actions/payment";
import Stripe from "stripe";
import { SelectedCourse } from "@/types/course";
import { Organization } from "@clerk/nextjs/server";
import handleConfetti from "@/components/ui/confetti";
import OnboardingContextProvider from "@/contexts/onboarding-context";
import Iphone from "@/components/iPhone";
import { useRouter } from "next/navigation";
import { Response } from "@/types/general";

export default function OnboardingCompletePage() {
  const [paymentIntent] = useQueryState("payment_intent", { defaultValue: "" });
  const { user, isLoaded } = useUser();

  if (!user || !isLoaded) return;
  return (
    <OnboardingContextProvider>
      <div className="page-container">
        {paymentIntent !== "" && <OnboardingCompleteWithPayment />}
        {paymentIntent === "" && <OnboardingCompleteWithoutPayment />}
      </div>
    </OnboardingContextProvider>
  );
}

function OnboardingCompleteComponent({
  component,
  componentWidth,
  componentHeight,
}: {
  component: React.ReactNode;
  componentWidth: number;
  componentHeight: number;
}) {
  return (
    <div className="size-full flex flex-col justify-between items-center">
      <h1 className="h1 text-center">Your onboarding is complete!</h1>

      {/* Thak You and Component */}
      <div className="w-full flex flex-col-reverse md:flex-row justify-center items-center gap-5 md:gap-20">
        {/* Thank You */}
        <div
          className={`w-1/2 h-${componentHeight} relative flex items-center justify-center unselectable`}
        >
          {/* Light Mode */}
          <div className="dark:hidden absolute inset-0 flex flex-col justify-between p-0">
            <Image
              src={ThankYouLightOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouLightOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouLightFilled}
              alt="Thank you"
              className="h-1/6 object-contain z-20 relative"
            />
            <Image
              src={ThankYouLightOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouLightOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
          </div>

          {/* Dark Mode */}
          <div className="hidden absolute inset-0 dark:flex flex-col justify-between p-0">
            <Image
              src={ThankYouDarkOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouDarkOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouDarkFilled}
              alt="Thank you"
              className="h-1/6 object-contain z-20 relative"
            />
            <Image
              src={ThankYouDarkOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
            <Image
              src={ThankYouDarkOutlined}
              alt="Thank you"
              className="h-1/6 object-contain opacity-70"
            />
          </div>

          <Image
            src={WomanHoldingHeart}
            alt="Onboarding completed"
            className="max-w-full max-h-full pt-5 object-contain z-10"
          />
        </div>

        {/* Component */}
        <div
          className={`w-${componentWidth} h-${componentHeight} flex justify-center`}
        >
          {component}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row md:justify-around gap-5 md:gap-20 mb-1">
        {/* TODO */}
        {/* <Link
          href={IOS_APP_LINK}
          target="_blank"
        >
          <StyledButton buttonType="action">
            <MdSmartphone />
            Download our app
          </StyledButton>
        </Link> */}

        <Link href="/dashboard">
          <StyledButton buttonType="action">
            <MdComputer />
            Go to dashboard
          </StyledButton>
        </Link>
      </div>
    </div>
  );
}

function OnboardingCompleteWithPayment() {
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
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [paymentIntent] = useQueryState("payment_intent", { defaultValue: "" });

  let activeCourses: SelectedCourse[];

  useEffect(() => {
    const formatConfirmationCode = (code: string): string => {
      const strStart = 3;
      const strLength = 6;
      const first6Chars = code
        .substring(strStart, strStart + strLength)
        .toUpperCase();
      return `C-${first6Chars}`;
    };

    const handleFinalOnboardingStep = (res: Response): void => {
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
    };

    const completeOnboardingWithPayment = async (
      paymentIntent: string | undefined
    ) => {
      if (!user) return;

      const publicMetadata = user.publicMetadata as unknown as UserMetadata;
      const { onboardingLink } = publicMetadata;
      if (!paymentIntent) router.push(onboardingLink);

      // Get transaction info from the payment intent.
      const paymentIntentDetails = await getPaymentIntent(paymentIntent!).then(
        (res) => {
          return res.data as Stripe.Response<Stripe.PaymentIntent>;
        }
      );

      if (paymentIntentDetails) {
        const metadata = paymentIntentDetails.metadata;
        activeCourses = JSON.parse(
          metadata.courses
        ) as unknown as SelectedCourse[];
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
      const userMetadata: UserMetadata = {
        ...publicMetadata,
        onboardingLink: "/onboarding",
        isOnboardingComplete: true,
        lastOnboardingStepCompleted: 3,
        courses: activeCourses,
      };

      await updateUserMetadata(user.id, userMetadata).then((res) => {
        const { role, organizations } = userMetadata;
        if (role !== "guardian" && organizations && organizations.length > 0) {
          const orgId = organizations[0];
          getOrganizationById(orgId).then((res) => {
            const organization = JSON.parse(res.data) as Organization;
            const orgMetadata =
              organization.publicMetadata as unknown as OrganizationMetadata;
            const newOrgMetadata: OrganizationMetadata = {
              ...orgMetadata,
              courses: activeCourses,
            };

            updateOrganization(orgId, newOrgMetadata).then((res) => {
              handleFinalOnboardingStep(res);
            });
          });
        } else {
          handleFinalOnboardingStep(res);
        }
      });
    };

    completeOnboardingWithPayment(paymentIntent);
  }, [isLoaded]);

  // TODO: Send digital receipt via Resend
  // TODO: Create downloadable PDF receipt
  // TODO: Add shortened and full confirmation codes to selectedCourse
  // TODO: Any students that guardians added need to be sent emails

  if (!user || !isLoaded || !isOnboardingComplete) return;
  return (
    <OnboardingCompleteComponent
      component={
        <Receipt
          transactionTotal={transactionTotal}
          transactionDate={transactionDate}
          transactionCode={transactionCode}
        />
      }
      componentWidth={80}
      componentHeight={96}
    />
  );
}

function OnboardingCompleteWithoutPayment() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { isOnboardingComplete, setIsOnboardingComplete, lastUpdated } =
    useOnboardingContext();
  const componentWidth = 80;
  const componentHeight = 96;

  useEffect(() => {
    const checkOnboardingCompletion = () => {
      if (!user) return;
      const publicMetadata = user.publicMetadata as unknown as UserMetadata;
      const { isOnboardingComplete, onboardingLink } = publicMetadata;

      setIsOnboardingComplete(isOnboardingComplete);
      if (!isOnboardingComplete) router.push(onboardingLink);
      else handleConfetti();
    };

    checkOnboardingCompletion();
  }, [isLoaded, lastUpdated]);

  if (!isLoaded) return <>loading...</>;
  if (isLoaded && !isOnboardingComplete)
    return <>you are not done with onboarding. redirecting...</>;
  return (
    <OnboardingCompleteComponent
      component={
        <div
          className={`w-${componentWidth} h-${componentHeight} relative overflow-y-hidden border-b border-default-color`}
        >
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Iphone />
          </div>
        </div>
      }
      componentWidth={componentWidth}
      componentHeight={componentHeight}
    />
  );
}
