"use client";

import {
  ClerkErrorResponse,
  getPronunciations,
  updateUserMetadata,
} from "@/app/actions/onboarding";
import { StyledActionButton } from "@/components/StyledButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ToastAction } from "@/components/ui/toast";
import { useSignUpContext } from "@/contexts/sign-up-content";
import { toast } from "@/hooks/use-toast";
import { UserMetadata } from "@/types/user";
import { useSignUp } from "@clerk/nextjs";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdRefresh } from "react-icons/md";

export default function VerifyEmailForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const {
    setFirstName,
    setLastName,
    emailAddress,
    setEmailAddress,
    code,
    setCode,
    error,
    setError,
    role,
    seconds,
    setSeconds,
    setPendingVerification,
    setPassword,
    setRole,
    setRelation,
    setIsTermsAccepted,
  } = useSignUpContext();
  const router = useRouter();
  const { t } = useTranslation();

  const [isLoadingPronunciationOptions, setIsLoadingPronunciationOptions] =
    useState<boolean>(false);
  const [pronunciationOptions, setPronunciationOptions] = useState<
    string[] | undefined
  >();

  // Pronunciations
  useEffect(() => {
    (async function () {
      setIsLoadingPronunciationOptions(true);
      await getPronunciations(
        String(`${signUp?.firstName} ${signUp?.lastName}`.trim())
      ).then((res) => {
        setPronunciationOptions(res.data.split(", "));
        setIsLoadingPronunciationOptions(false);
      });
    })();
  }, [signUp?.firstName, signUp?.lastName]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) return prevSeconds - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    await signUp
      .attemptEmailAddressVerification({ code })
      .then((signUp) => {
        const { createdUserId, createdSessionId, status } = signUp;

        if (status === "complete") {
          setActive({ session: createdSessionId })
            .then(() => {
              const userId = createdUserId as string;
              const userMetadata: UserMetadata = {
                role,
                pronunciation: "",
                currPronunciationOptions: pronunciationOptions || [],
                prevPronunciationOptions: [],
                isOnboardingComplete: false,
                lastOnboardingStepCompleted: 0,
                onboardingLink: "/onboarding",
                pronouns: "",
                hasCustomPronouns: false,
                emojiSkinTone: "default",
                organizations: null,
                courses: [],
                classes: null,
                invitations: null,
              };

              fetch("/api/resend/new-user", { method: "POST" });
              updateUserMetadata(userId, userMetadata);
            })
            .catch(() => {
              toast({
                variant: "destructive",
                title: "Error verifying email",
                description:
                  "There was an issue verifying your email. Try again or contact support if the issue persists.",
                action: (
                  <ToastAction
                    altText="Try again"
                    className="flex gap-2"
                    onClick={() => handleVerifyEmail(e)}
                  >
                    <MdRefresh />
                    Try again
                  </ToastAction>
                ),
              });
            });

          router.push("/onboarding");

          // Resets some local storage items in case a previous user has signed up on the same device.
          if (role === "admin") localStorage.setItem("createOrJoin", "create");
          else localStorage.setItem("createOrJoin", "join");
          localStorage.setItem("onboardingStep", "1");
        } else {
          setFirstName("");
          setLastName("");
          setEmailAddress("");
          setPassword("");
          setError("");
          setRole(null);
          setRelation("");
          setIsTermsAccepted(false);
          setPendingVerification(false);
          setSeconds(0);
        }
      })
      .catch((err: ClerkErrorResponse) => {
        if (code !== "") setError("Invalid code. Please try again.");
        else setError(err.errors[0].message);
      });
  }

  async function resubmit() {
    const toastSuccess = () =>
      toast({
        title: "Email sent! 👍🏿",
        description: `We sent another code to ${emailAddress}!`,
      });

    const toastFailure = () =>
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Token expired. Please refresh your browser",
        action: (
          <ToastAction
            altText="Refresh"
            className="flex gap-2"
            onClick={async () => location.reload()}
          >
            <MdRefresh />
            Refresh
          </ToastAction>
        ),
      });

    if (signUp !== undefined) {
      await signUp
        .prepareEmailAddressVerification({ strategy: "email_code" })
        .then(() => {
          toastSuccess();
          setSeconds(60);
        })
        .catch(() => {
          toastFailure();
        });
    } else {
      toastFailure();
    }
  }

  return (
    <form onSubmit={handleVerifyEmail} className="flex flex-col gap-5 w-full">
      {/* OTP */}
      <div className="form-item items-center">
        <InputOTP
          maxLength={6}
          name="verification_code"
          id="verification_code"
          value={code}
          onChange={(e) => setCode(e)}
          pattern={REGEXP_ONLY_DIGITS}
          required
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="relative w-12 h-12 text-2xl font-semibold"
                />
              ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Error (if applicable) */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* "Verify email" Button */}
      <StyledActionButton
        type="submit"
        disabled={isLoadingPronunciationOptions}
      >
        {t("sign-up:verify-email")}
      </StyledActionButton>

      {/* "Resend code" Button */}
      <Button variant="link" onClick={resubmit} disabled={seconds !== 0}>
        <span className="text-sm text-muted-foreground">
          {seconds === 0
            ? t("sign-up:resend-code")
            : seconds === 1
              ? t("sign-up:resend-code-singular", { seconds })
              : t("sign-up:resend-code-plural", { seconds })}
        </span>
      </Button>
    </form>
  );
}
