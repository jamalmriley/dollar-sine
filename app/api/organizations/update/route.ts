import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { OrgMetadata, PostResponse } from "@/utils/api";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("orgId") as string;
  const name = searchParams.get("orgName") as string;
  const slug = searchParams.get("orgSlug") as string;
  const organizationAddress = searchParams.get("orgAddress") as string;
  const is2FARequired = Boolean(searchParams.get("is2FARequired")) || false;
  const file = (await request.formData()).get("image") as File;

  const publicMetadata: OrgMetadata = { organizationAddress, is2FARequired };

  console.log("The org ID is", id);

  const update: PostResponse = await client.organizations
    .updateOrganization(id, {
      name,
      slug,
      publicMetadata,
    })
    .then(() => {
      try {
        if (file) client.organizations.updateOrganizationLogo(id, { file });
      } catch (err) {
        console.error(err);
        return {
          status: 400,
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
      console.error(err);
      return {
        status: 400,
        success: false,
        message: {
          title: "Error updating organization",
          description: JSON.stringify(err),
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
