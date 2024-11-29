import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "user_";
  const role = searchParams.get("role") || "student";

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });
  return NextResponse.json({ success: true });
}
