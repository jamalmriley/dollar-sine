import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { PostResponse } from "@/utils/api";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id") as string;
  const onboardingLink = searchParams
    .get("onboarding_link")
    ?.replaceAll(">", "&"); // Undoes the replacing of "&" with ">" so that the real pathname is saved to the user's metadata.

  const update: PostResponse = await client.users
    .updateUserMetadata(userId, {
      publicMetadata: { onboardingLink },
    })
    .then((user) => {
      return {
        status: 200,
        success: true,
        message: {
          title: "Onboarding progress saved ✅",
          description: "Your onboarding progress has been successfully saved.",
        },
      };
    })
    .catch((err) => {
      const error = err.errors[0];
      console.error(err);
      return {
        status: parseInt(error.code),
        success: false,
        message: {
          title: "Error saving onboarding progress",
          description: error.longMessage,
        },
      };
    });

  return NextResponse.json(update);
}
