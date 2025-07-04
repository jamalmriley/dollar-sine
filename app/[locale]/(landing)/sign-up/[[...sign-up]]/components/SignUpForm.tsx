"use client";

import { ClerkErrorResponse } from "@/app/actions/onboarding";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignUpContext } from "@/contexts/sign-up-content";
import { beginsWithVowel } from "@/utils/general";
import { GUARDIAN_TYPES, GuardianType, Role } from "@/types/user";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { StyledActionButton } from "@/components/StyledButtons";

export default function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    setPendingVerification,
    error,
    setError,
    role,
    setRole,
    relation,
    setRelation,
    isTermsAccepted,
    setIsTermsAccepted,
    setSeconds,
  } = useSignUpContext();
  const { t } = useTranslation();

  const roles = ["Teacher", "Administrator"];

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded) return;
    setError("");

    await signUp
      .create({
        firstName,
        lastName,
        emailAddress,
        password,
      })
      .then(() => {
        signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
        setSeconds(60);
      })
      .catch((err: ClerkErrorResponse) => {
        setError(err.errors[0].message);
      });
  }

  return (
    <form onSubmit={handleSignUp} className="flex flex-col w-full gap-5">
      {/* First and Last Name */}
      <div className="form-row">
        <div className="form-item">
          <Label htmlFor="firstName">{t("sign-up:first-name")}</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
            name="firstName"
            placeholder="John"
            type="text"
            autoCapitalize="on"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="form-item">
          <Label htmlFor="lastName">{t("sign-up:last-name")}</Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
            name="lastName"
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
        <Label htmlFor="emailAddress">{t("sign-up:email")}</Label>
        <Input
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          id="emailAddress"
          name="emailAddress"
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
                {relation === "" || !beginsWithVowel(relation) ? "a" : "an"}
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild id="role" name="role">
                {relation === "" ? (
                  <Button variant="outline">Choose a role</Button>
                ) : (
                  <span className="flex">
                    <span className="border-b px-2 pb-1">{relation}</span>.
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
                      {GUARDIAN_TYPES.map((guardianType, idx) => (
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
                          : (role.toLowerCase() as Role);
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

      {/* Error (if applicable) */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* "Sign up" button */}
      <StyledActionButton
        type="submit"
        disabled={
          firstName === "" ||
          lastName === "" ||
          emailAddress === "" ||
          password === "" ||
          !role ||
          relation === "" ||
          !isTermsAccepted
        }
      >
        {t("sign-up:sign-up")}
      </StyledActionButton>
    </form>
  );
}
