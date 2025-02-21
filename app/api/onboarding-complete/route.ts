import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Response } from "@/utils/api";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id") as string;
  const locale = searchParams.get("locale") as string;
  const onboardingLink = `/${locale}/onboarding`;

  const update: Response = await client.users
    .updateUserMetadata(userId, {
      publicMetadata: { isOnboardingCompleted: true, onboardingLink },
    })
    .then((user) => {
      // console.log(user);
      return {
        status: 200,
        success: true,
        message: {
          title: "Onboarding successfully completed",
          description: `User ${user.id} has successfully completed their onboarding.`,
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
          title: "Error completing onboarding",
          description: error.longMessage,
        },
      };
    });

  return NextResponse.json(update);
}
