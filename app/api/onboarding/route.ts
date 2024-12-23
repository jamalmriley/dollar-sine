import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id") as string;
  const onboardingLink = searchParams
    .get("onboarding_link")
    ?.replaceAll(">", "&"); // Undoes the replacing of "&" with ">" so that the real pathname is saved to the user's metadata.

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { onboardingLink },
  });
  return NextResponse.json({ success: true });
}
