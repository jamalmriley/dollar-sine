import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
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
    .createOrganization({
      name,
      slug,
      createdBy,
      maxAllowedMemberships: 10,
      publicMetadata,
    })
    .then((org) => {
      try {
        const organizationId = org.id;

        // If the file is null, it will return as the string "null".
        // So it should only update the logo when it is an actual file.
        if (typeof file !== "string") {
          client.organizations.updateOrganizationLogo(organizationId, { file });
        }

        setDoc(doc(db, "organizations", slug), {
          id: org.id,
          name,
          slug,
          members: [createdBy],
        })
          .then(() => {
            console.log("Organization successfully added to Firebase!");
          })
          .catch((error: any) => {
            console.error("Error adding organization to Firebase: ", error);
            // TODO: Return a message about the organization failing to be updated in our database. The message should say that the team has been notified of the issue.
            // TODO: Use Resend (and possible Twilio) to send a message to notify team of the issue. 
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
        message: "Error creating organization. Please refresh and try again.",
      });
    });

  return NextResponse.json({
    status: 200,
    success: true,
    message: "Organization successfully created ✅",
  });
}
