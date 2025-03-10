"use client";

import {
  ClerkErrorResponse,
  updateUserMetadata,
} from "@/app/actions/onboarding";
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
import { AdminMetadata, PublicMetadata, TeacherMetadata } from "@/utils/user";
import { useSignUp } from "@clerk/nextjs";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
              const data: FormData = new FormData();

              const userId = createdUserId as string;

              const coreMetadata: PublicMetadata = {
                role,
                isOnboardingCompleted: false,
                lastOnboardingStepCompleted: 0,
                onboardingLink: "/onboarding",
                pronouns: [],
                emojiSkinTone: "default",
                organizations: [],
                courses: [],
                classes: null,
              };

              let metadata: AdminMetadata | TeacherMetadata | null;

              switch (role) {
                case "admin":
                  metadata = {
                    ...coreMetadata,
                  };
                  break;
                case "teacher":
                  metadata = {
                    ...coreMetadata,
                  };
                  break;

                default:
                  metadata = null;
                  break;
              }

              const publicMetadata = JSON.stringify(metadata);

              data.append("userId", userId);
              data.append("publicMetadata", publicMetadata);

              updateUserMetadata(data);
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

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

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
      <Button
        type="submit"
        className="w-full font-semibold bg-antique-brass-950 dark:bg-antique-brass-100"
      >
        {t("sign-up:verify-email")}
      </Button>

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
