import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "@/utils/roles";
import { PostResponse } from "@/utils/api";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user_";
  const role = searchParams.get("role") as Role;
  const relation = searchParams.get("relation") || "other";
  const body = await request.formData();
  const prefix = body.get("prefix") || "";
  const displayName = body.get("displayName") || "";
  const displayNameFormat = body.get("displayNameFormat") || "";
  const jobTitle = body.get("jobTitle") || "";
  const pronouns = body.get("pronouns") || "";
  const skinTone = body.get("skinTone") || "";

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

  const update: PostResponse = await client.users
    .updateUserMetadata(userId, { publicMetadata })
    .then(() => {
      try {
        // If the file is null, it will return as the string "null".
        // So it should only update the profile picture when it is an actual file.
        const file = body.get("image") as File;
        if (typeof file !== "string") {
          client.users.updateUserProfileImage(userId, { file });
        }
      } catch (err) {
        console.error(err);
        return {
          status: 400,
          success: false,
          message: {
            title: "Error updating profile",
            description:
              "Your profile picture could not be uploaded. Please try again.",
          },
        };
      }

      return {
        status: 200,
        success: true,
        message: {
          title: "Profile succesfully updated ✅",
        },
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        status: 400,
        success: false,
        message: {
          title: "Error updating profile",
          description:
            "There was an issue updating your profile. Please try again.",
        },
      };
    });

  return NextResponse.json(update);
}
