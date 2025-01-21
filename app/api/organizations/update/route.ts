import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

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

  await client.organizations
    .updateOrganization(id, {
      name,
      slug,
      maxAllowedMemberships: 10,
      publicMetadata,
    })
    .then(() => {
      try {
        if (file) client.organizations.updateOrganizationLogo(id, { file });

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
      }
    })
    .catch((err) => {
      console.log(err);
      return NextResponse.json({
        status: 200,
        success: false,
        message: "Error updating organization. Please refresh and try again.",
      });
    });

  return NextResponse.json({
    status: 200,
    success: true,
    message: "Organization successfully updated ✅",
  });
}
