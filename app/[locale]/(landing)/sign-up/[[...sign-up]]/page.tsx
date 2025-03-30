"use client";

import { FullLogo } from "@/components/Logo";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useSignUpContext } from "@/contexts/sign-up-content";
import SignUpForm from "./components/SignUpForm";
import VerifyEmailForm from "./components/VerifyEmailForm";
import StyledButton from "@/components/StyledButton";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { BiLogoGmail } from "react-icons/bi";

export default function SignUpPage() {
  const { isLoaded } = useSignUp();
  const { firstName, emailAddress, pendingVerification } = useSignUpContext();

  if (!isLoaded) return null;
  return (
    <div className="page-container flex justify-center items-center w-full md:p-0">
      {/* Left Side */}
      <div className="hidden md:flex flex-col pl-10 w-1/2 h-full bg-gradient-to-r from-givry-50 via-givry-from-givry-50 dark:from-woodsmoke-950 dark:via-woodsmoke-950 to-transparent text-antique-brass-950 dark:text-antique-brass-100 justify-center">
        <h1 className="h1 mb-5">
          {!pendingVerification
            ? "Get started today"
            : `Check your email, ${firstName}!`}
        </h1>
        <div className="flex items-center gap-3">
          <h2 className="subtitle text-antique-brass-800 dark:text-antique-brass-50">
            {!pendingVerification
              ? "See what the hype is all about."
              : `We just sent a 6-digit code to ${emailAddress}.`}
          </h2>
        </div>
        {/* Email Buttons */}
        {pendingVerification && (
          <div className="flex gap-10">
            <Link href="https://mail.google.com/mail/u/0/" target="_blank">
              <StyledButton>
                <BiLogoGmail />
                Open Gmail
              </StyledButton>
            </Link>
            <Link href="https://outlook.live.com/mail/0/" target="_blank">
              <StyledButton>
                <PiMicrosoftOutlookLogoFill />
                Open Outlook
              </StyledButton>
            </Link>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full px-0 md:pr-10 flex justify-center items-center">
        <Card className="flex flex-col gap-3 w-full max-w-md dark:bg-woodsmoke-950">
          <CardHeader className="flex flex-col items-center">
            <div className="mb-3 md:mb-0">
              <FullLogo />
            </div>
            <CardTitle className="text-2xl font-bold text-center md:hidden">
              {!pendingVerification
                ? "Get started for free"
                : `Check your email, ${firstName}!`}
            </CardTitle>
            <span className="text-sm text-muted-foreground text-center md:hidden">
              {!pendingVerification
                ? "No credit card required"
                : `We just sent a code to ${emailAddress}.`}
            </span>
          </CardHeader>
          <CardContent>
            {!pendingVerification ? <SignUpForm /> : <VerifyEmailForm />}
            {/* !pendingVerification ? <>SignUpForm</> : <>VerifyEmailForm</> */}
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
