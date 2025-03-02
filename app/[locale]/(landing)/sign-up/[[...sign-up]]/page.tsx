"use client";

import { FullLogo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { beginsWithVowel } from "@/utils/general";
import { useSignUp } from "@clerk/nextjs";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdRefresh } from "react-icons/md";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [relation, setRelation] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const roles = ["Teacher", "Administrator"];

  const guardianTypes: string[] = [
    "Parent",
    "Stepparent",
    "Grandparent",
    "Aunt",
    "Uncle",
    "Older sibling",
    "Foster parent",
    "Adoptive parent",
    "Family member",
    "Guardian",
    "Caregiver",
  ];

  const router = useRouter();

  async function addMetadataToUser(userId: string) {
    const body: FormData = new FormData();
    await fetch(
      `/api/users/update?userId=${userId}&role=${role}&relation=${relation}`,
      { method: "POST", body }
    )
      .then((res) => res.json())
      .then(() => {
        toast({
          variant: "default",
          title: "User successfully created! ✅",
          description: "Welcome to Dollar Sine! Let's get you set up.",
        });
      })
      .catch(() => {
        // console.error(err);
        toast({
          variant: "destructive",
          title: "Error creating user",
          description:
            "There was an issue setting up your account. Please try again.",
          action: (
            <ToastAction
              altText="Try again"
              className="flex gap-2"
              onClick={() => addMetadataToUser(userId)}
            >
              <MdRefresh />
              Try again
            </ToastAction>
          ),
        });
      });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp
        .create({
          firstName,
          lastName,
          emailAddress,
          password,
        })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // TODO: Set loading state to be false.
        });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      await setPendingVerification(true);
      await setSeconds(60);
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    }
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

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
          .then(() => {
            const userId = completeSignUp.createdUserId as string;
            addMetadataToUser(userId);
          })
          .catch((error) => {
            console.error("Error updating user: ", error);
          });

        router.push("/onboarding");
      }
    } catch (err: any) {
      if (code !== "") setError("Invalid code. Please try again.");
      else setError(err.errors[0].message);
    }
  }

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  if (!isLoaded) return null;
  return (
    // <div className="page-container flex justify-center items-center">
    <div className="page-container flex justify-center items-center w-full md:p-0">
      {/* Left Side */}
      <div className="hidden md:flex flex-col pl-10 w-1/2 h-full bg-gradient-to-r from-givry-50 via-givry-from-givry-50 dark:from-woodsmoke-950 dark:via-woodsmoke-950 to-transparent text-antique-brass-950 dark:text-antique-brass-100 justify-center">
        <h1 className="h1 mb-3">
          {!pendingVerification
            ? "Get started today"
            : `Check your email, ${firstName}!`}
        </h1>
        <h2 className="subtitle text-antique-brass-800 dark:text-antique-brass-50">
          {!pendingVerification
            ? "See what the hype is all about."
            : `We just sent a code to ${emailAddress}.`}
        </h2>
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
            {!pendingVerification ? (
              // Sign-up Form
              <form onSubmit={submit} className="flex flex-col w-full gap-5">
                {/* First and Last Name */}
                <div className="form-row">
                  <div className="form-item">
                    <Label htmlFor="firstname">{t("sign-up:first-name")}</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      id="firstname"
                      name="firstname"
                      placeholder="John"
                      type="text"
                      autoCapitalize="on"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="form-item">
                    <Label htmlFor="lastname">{t("sign-up:last-name")}</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      id="lastname"
                      name="lastname"
                      placeholder="Doe"
                      type="text"
                      autoCapitalize="on"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-item">
                  <Label htmlFor="email">{t("sign-up:email")}</Label>
                  <Input
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="off"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-item">
                  <Label htmlFor="password">{t("sign-up:password")}</Label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autoCapitalize="off"
                    autoComplete="new-password"
                    required
                  />
                </div>

                {/* Role */}
                <div className="form-item">
                  <Label htmlFor="role">Which role best describes you?</Label>
                  <div className="flex items-end h-9">
                    <div className="flex gap-3 items-baseline min-w-fit text-sm">
                      {relation !== "" && (
                        <>
                          I am{" "}
                          {relation === "" || !beginsWithVowel(relation)
                            ? "a"
                            : "an"}
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild id="role" name="role">
                          {relation === "" ? (
                            <Button variant="outline">Choose a role</Button>
                          ) : (
                            <span className="flex">
                              <span className="border-b px-2 pb-1">
                                {relation}
                              </span>
                              .
                            </span>
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span>Parent/Guardian</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {guardianTypes.map((guardianType, idx) => (
                                  <DropdownMenuItem
                                    key={idx}
                                    onClick={() => {
                                      setRole("guardian");
                                      setRelation(guardianType.toLowerCase());
                                    }}
                                  >
                                    <span>{guardianType}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          {roles.map((role, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              onClick={() => {
                                const val =
                                  role === "Administrator"
                                    ? "admin"
                                    : role.toLowerCase();
                                setRole(val);
                                setRelation(role.toLowerCase());
                              }}
                            >
                              <span>{role}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Terms of Service */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={isTermsAccepted}
                    onClick={() => setIsTermsAccepted((val) => !val)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <span className="text-muted-foreground hover:underline">
                      <Link href="/legal">Terms and Conditions</Link>
                    </span>
                    .
                  </Label>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* "Sign up" button */}
                <Button
                  type="submit"
                  className="w-full font-semibold bg-antique-brass-950 dark:bg-antique-brass-100"
                  disabled={
                    firstName === "" ||
                    lastName === "" ||
                    emailAddress === "" ||
                    password === "" ||
                    role === "" ||
                    relation === "" ||
                    !isTermsAccepted
                  }
                >
                  {t("sign-up:sign-up")}
                </Button>
              </form>
            ) : (
              // Verify Email Form
              <form
                onSubmit={onPressVerify}
                className="flex flex-col gap-5 w-full"
              >
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
                      <InputOTPSlot
                        index={0}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                      <InputOTPSlot
                        index={1}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                      <InputOTPSlot
                        index={2}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                      <InputOTPSlot
                        index={3}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                      <InputOTPSlot
                        index={4}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                      <InputOTPSlot
                        index={5}
                        className="relative w-12 h-12 text-2xl font-semibold"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

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
                <Button
                  variant="link"
                  onClick={resubmit}
                  disabled={seconds !== 0}
                >
                  <span className="text-sm text-muted-foreground">
                    {seconds === 0
                      ? t("sign-up:resend-code")
                      : seconds === 1
                      ? t("sign-up:resend-code-singular", { seconds })
                      : t("sign-up:resend-code-plural", { seconds })}
                  </span>
                </Button>
              </form>
            )}
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
