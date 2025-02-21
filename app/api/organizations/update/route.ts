import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Response } from "@/utils/api";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("orgId") || "";
  const name = searchParams.get("orgName") || "";
  const slug = searchParams.get("orgSlug") || "";
  const createdBy = searchParams.get("userId") || "";
  const organizationAddress = searchParams.get("orgAddress") || "";
  const organizationJoinCode = searchParams.get("orgJoinCode") || "";
  const is2FARequired = Boolean(searchParams.get("is2FARequired")) || false;
  const file = (await request.formData()).get("image") as File;

  const publicMetadata = {
    organizationAddress,
    organizationJoinCode,
    is2FARequired,
  };

  const update: Response = await client.organizations
    .updateOrganization(id, {
      name,
      slug,
      maxAllowedMemberships: 10,
      publicMetadata,
    })
    .then(() => {
      try {
        if (file) client.organizations.updateOrganizationLogo(id, { file });
      } catch (err) {
        console.error(err);
        return {
          status: 500,
          success: false,
          message: {
            title: "Error updating organization",
            description:
              "The organization's logo could not be uploaded. Please try again.",
          },
        };
      }
      return {
        status: 200,
        success: true,
        message: {
          title: "Organization successfully updated ✅",
          description: "",
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
          title: "Error updating organization",
          description: error.longMessage,
        },
      };
    });

  return NextResponse.json(update);
}

/* try {
  setDoc(doc(db, "organizations", slug), {
    id,
    name,
    slug,
    members: [createdBy],
  })
    .then(() => {
      console.log("Organization successfully updated in Firebase!");
    })
    .catch((error: any) => {
      console.error("Error updating organization in Firebase: ", error);
    });
} catch (err) {
  console.error(err);
} */
