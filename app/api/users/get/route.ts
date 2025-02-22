import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { GetResponse, UserData } from "@/utils/api";

export async function GET(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") as string;

  const user: GetResponse = await client.users
    .getUser(userId)
    .then((user) => {
      const data: UserData = {
        id: user.id,
        createdAt: user.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        emailAddresses: user.emailAddresses,
        publicMetadata: user.publicMetadata,
      };

      return {
        status: 200,
        success: true,
        data,
        message: {
          title: "User succesfully retrieved",
        },
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        status: 400,
        success: false,
        data: {},
        message: {
          title: "Error retrieving user",
        },
      };
    });

  return NextResponse.json(user);
}
