import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { GetResponse } from "@/utils/api";

export async function GET(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId") as string;

  const org: GetResponse = await client.organizations
    .getOrganization({ organizationId })
    .then((org) => {
      const data = {
        id: org.id,
        createdAt: org.createdAt,
        createdBy: org.createdBy,
        name: org.name,
        slug: org.slug,
        imageUrl: org.imageUrl,
        maxAllowedMemberships: org.maxAllowedMemberships,
        publicMetadata: org.publicMetadata,
      };

      return {
        status: 200,
        success: true,
        data,
        message: {
          title: "Organization succesfully retrieved",
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
          title: "Error retrieving organization",
        },
      };
    });

  return NextResponse.json(org);
}
