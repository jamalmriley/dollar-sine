"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/utils/firebase";
import { useSignUp } from "@clerk/nextjs";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("Jamal");
  const [lastName, setLastName] = useState("Riley");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");

  const roles = [
    { label: "Student", value: "student" },
    { label: "Parent/Guardian", value: "guardian" },
    { label: "Teacher", value: "teacher" },
    { label: "Admin", value: "admin" },
    { label: "Super Admin", value: "super_admin" },
  ];

  const router = useRouter();

  if (!isLoaded) return null;

  async function addMetadataToUser(userId: string) {
    const res = await fetch(
      `http://localhost:3000/api/users?userId=${userId}&role=${role}`,
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
          // const userId = user.id as string;
          setDoc(doc(db, "users", emailAddress), {
            firstName,
            lastName,
            emailAddress,
            emailVerified: false,
            createdAt: new Date(),
            role,
            isOnboardingCompleted: false,
            guardians: [],
            enrolledCourses: [],
            organizations: [],
            tools: [],
            profile: {
              summary: "",
              personal: {
                lives_with: [],
                pets: [],
                transpo: null,
                interests: [],
                spendingCategories: [],
                savingsGoals: [],
              },
              academic: {
                gradeLevel: null,
                track: null,
                testScores: {
                  iReady: {
                    overallScore: null,
                    noScore: null,
                    aaScore: null,
                    geoScore: null,
                    mdScore: null,
                  },
                  nweaMap: {
                    overallScore: null,
                    noScore: null,
                    oaScore: null,
                    geoScore: null,
                    mdScore: null,
                  },
                },
              },
            },
          })
            .then(() => {
              console.log("User sucessully created!");
            })
            .catch((error: any) => {
              console.error("Error creating user: ", error);
            });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // TODO: Set loading state to be false.
        });

      // Create Firebase doc with emailVerified: false, createdAt: new Date(), etc.

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

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Get started with Dollar Sine
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                I am a
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{role}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.value}
                        onClick={() => setRole(role.value)}
                      >
                        {role.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                />
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
