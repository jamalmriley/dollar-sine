import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export type Role = "student" | "guardian" | "teacher" | "admin";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user_";
  const role = searchParams.get("role") as Role;
  const relation = searchParams.get("relation") || "other";

  const publicMetadata = {
    student: {
      displayName: null,
      role,
      isOnboardingCompleted: false,
      onboardingLink: "/onboarding",
      guardians: [],
      organizations: [],
      classes: [],
      myCourses: [],
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
    },
    guardian: {
      displayName: null,
      role,
      isOnboardingCompleted: false,
      onboardingLink: "/onboarding",
      organizations: [],
      classes: [],
      myCourses: [],
      students: [],
      profile: {
        relation,
        pronouns: null,
      },
    },
    teacher: {
      displayName: null,
      role,
      relation,
      jobTitle: "",
      isOnboardingCompleted: false,
      onboardingLink: "/onboarding",
      organizations: [],
      classes: [],
      myCourses: [],
      students: [],
      profile: {
        relation,
        pronouns: null,
      },
    },
    admin: {
      displayName: null,
      role,
      relation: "admin",
      jobTitle: "",
      isOnboardingCompleted: false,
      onboardingLink: "/onboarding",
      organizations: [],
      classes: [],
      myCourses: [],
      students: [],
      profile: {
        relation,
        pronouns: null,
      },
    },
  };

  await client.users.updateUserMetadata(userId, {
    publicMetadata: publicMetadata[role],
  });
  return NextResponse.json({ success: true });
}
