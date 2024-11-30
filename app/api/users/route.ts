import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user_";
  const role = searchParams.get("role") || "student";

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
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
    },
  });
  return NextResponse.json({ success: true });
}
