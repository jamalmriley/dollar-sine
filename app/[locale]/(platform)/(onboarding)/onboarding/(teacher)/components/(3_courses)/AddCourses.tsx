import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import React from "react";

export default function AddCourses() {
  const { currOnboardingStep, setCurrOnboardingStep } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  const userMetadata = user?.publicMetadata as any as UserMetadata;

  const header = {
    title: "Browse and add courses.",
    description: "Select the courses you want to add for your organization.",
  };

  return (
    <Card className="w-full h-full mx-10 max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent></CardContent>
    </Card>
  );
}
