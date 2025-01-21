import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "@/utils/roles";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user_";
  const role = searchParams.get("role") as Role;
  const relation = searchParams.get("relation") || "other";
  const body = await request.formData();
  const prefix = body.get("prefix") as String;
  const displayName = body.get("displayName") as String;
  const displayNameFormat = body.get("displayNameFormat") as String;
  const jobTitle = body.get("jobTitle") as String;
  const pronouns = body.get("pronouns") as String;
  const skinTone = body.get("skinTone") as String;
  const file = body.get("image") as File;

  const metadata = {
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
      role,
      isOnboardingCompleted: false,
      onboardingLink: "/onboarding",
      organizations: [],
      classes: [],
      myCourses: [],
      students: [],
      profile: {
        prefix,
        displayName,
        displayNameFormat,
        jobTitle,
        pronouns,
        relation,
        skinTone,
      },
    },
  };

  const publicMetadata = metadata[role];

  type Response = {
    status: number;
    success: boolean;
    message: { title: string; description: string };
  };

  const responses: Response[] = [];

  await client.users
    .updateUserMetadata(userId, { publicMetadata })
    .then((user) => {
      // If the file is null, it will return as the string "null".
      // So it should only update the profile picture when it is an actual file.
      if (typeof file !== "string") {
        client.users
          .updateUserProfileImage(userId, { file })
          .then(() => {
            return {
              status: 200,
              success: true,
              message: {
                title: "Profile picture successfully updated ✅",
                description: `Looking good, ${user.firstName}!`,
              },
            };
          })
          .catch((err) => {
            console.error(err);
            return {
              status: 400,
              success: false,
              message: {
                title: "Error updating profile picture",
                description:
                  "Please try again. If the issue persists, please contact support.",
              },
            };
          });
      }

      responses.push({
        status: 200,
        success: true,
        message: {
          title: "User succesfully updated ✅",
          description: "",
        },
      });
    })
    .catch((err) => {
      console.error(err);
      responses.push({
        status: 400,
        success: false,
        message: {
          title: "Error updating user",
          description: "Bad request. Please try again.",
        },
      });
    });

  return NextResponse.json(responses);
}
