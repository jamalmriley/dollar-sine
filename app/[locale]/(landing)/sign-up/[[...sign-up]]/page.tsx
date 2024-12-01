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
import { db } from "@/utils/firebase";
import { beginsWithVowel } from "@/utils/general";
import { useSignUp } from "@clerk/nextjs";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { t } = useTranslation();

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

  const [firstNamePlaceholder, setFirstNamePlaceholder] = useState("John");
  const [lastNamePlaceholder, setLastNamePlaceholder] = useState("Doe");

  const roles = ["Teacher", "Administrator"];

  const guardianTypes: string[] = [
    "Parent",
    "Stepparent",
    "Grandparent",
    "Aunt",
    "Uncle",
    "Older sibling",
    "Older stepsibling",
    "Foster parent",
    "Adoptive parent",
    "Family member",
    "Guardian",
    "Caregiver",
  ];

  const innovators: { firstName: string; lastName: string }[] = [
    { firstName: "Benjamin", lastName: "Banneker" },
    { firstName: "David", lastName: "Blackwell" },
    { firstName: "Elbert Frank", lastName: "Cox" },
    { firstName: "Mark", lastName: "Dean" },
    { firstName: "Lonnie", lastName: "Johnson" },
    { firstName: "John", lastName: "Urschel" },

    { firstName: "Marjorie", lastName: "Lee Browne" },
    { firstName: "Annie", lastName: "Easley" },
    { firstName: "Euphemia", lastName: "Haynes" },
    { firstName: "Fern", lastName: "Hunt" },
    { firstName: "Mae", lastName: "Jemison" },
    { firstName: "Katherine", lastName: "Johnson" },
    { firstName: "Valerie", lastName: "Thomas" },
  ];

  const router = useRouter();

  async function addMetadataToUser(userId: string) {
    const res = await fetch(
      `http://localhost:3000/api/users?userId=${userId}&role=${role}&relation=${relation}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((json) => console.log(json));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      await signUp
        .create({
          firstName,
          lastName,
          emailAddress,
          password,
        })
        .then(() => {
          // TODO: Toaster notification welcoming the user?
          // setDoc(doc(db, "users", emailAddress), {
          //   firstName,
          //   lastName,
          //   emailAddress,
          //   emailVerified: false,
          //   createdAt: new Date(),
          //   role,
          //   isOnboardingCompleted: false,
          //   guardians: [],
          //   enrolledCourses: [],
          //   organizations: [],
          //   tools: [],
          //   profile: {
          //     summary: "",
          //     personal: {
          //       lives_with: [],
          //       pets: [],
          //       transpo: null,
          //       interests: [],
          //       spendingCategories: [],
          //       savingsGoals: [],
          //     },
          //     academic: {
          //       gradeLevel: null,
          //       track: null,
          //       testScores: {
          //         iReady: {
          //           overallScore: null,
          //           noScore: null,
          //           aaScore: null,
          //           geoScore: null,
          //           mdScore: null,
          //         },
          //         nweaMap: {
          //           overallScore: null,
          //           noScore: null,
          //           oaScore: null,
          //           geoScore: null,
          //           mdScore: null,
          //         },
          //       },
          //     },
          //   },
          // })
          //   .then(() => {
          //     console.log("User sucessully created!");
          //   })
          //   .catch((error: any) => {
          //     console.error("Error creating user: ", error);
          //   });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // TODO: Set loading state to be false.
        });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
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
        await setActive({ session: completeSignUp.createdSessionId });
        await updateDoc(doc(db, "users", emailAddress), {
          emailVerified: true,
        })
          .then(() => {
            const userId = completeSignUp.createdUserId as string;
            addMetadataToUser(userId);
            console.log("User sucessully updated!");
          })
          .catch((error: any) => {
            console.error("Error updating user: ", error);
          });

        router.push("/onboarding");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      // setError(err);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const randInt = Math.floor(Math.random() * innovators.length);
      setFirstNamePlaceholder(innovators[randInt].firstName);
      setLastNamePlaceholder(innovators[randInt].lastName);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="page-container flex justify-center items-center">
      <Card className="flex flex-col gap-5 w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-3">
            <FullLogo />
          </div>

          <CardTitle className="text-2xl font-bold text-center">
            Get started for free
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            No credit card required
          </span>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
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
                    placeholder={firstNamePlaceholder}
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
                    placeholder={lastNamePlaceholder}
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
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="off"
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Role */}
              <div className="flex gap-3 items-baseline min-w-fit">
                {relation !== "" && (
                  <>
                    I{firstName === "" ? " " : `, ${firstName}, `}am{" "}
                    {relation === "" || !beginsWithVowel(relation) ? "a" : "an"}
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {relation === "" ? (
                      <Button variant="outline">
                        Select a role that best describes you.
                      </Button>
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

              {/* Terms of Service */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isTermsAccepted}
                  onClick={() => setIsTermsAccepted(!isTermsAccepted)}
                />
                <Label
                  htmlFor="terms"
                  className="text-xs font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and accept the{" "}
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
                Sign Up
              </Button>
            </form>
          ) : (
            <form
              onSubmit={onPressVerify}
              className="flex flex-col gap-5 w-full"
            >
              <div className="form-item items-center">
                <Label htmlFor="code">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e)}
                  pattern={REGEXP_ONLY_DIGITS}
                  required
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Verify Email
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
  );
}
