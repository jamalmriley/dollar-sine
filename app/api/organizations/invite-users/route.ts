import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { listItemsAsString } from "@/utils/general";
import { InvitationError, InvitationResponse, PostResponse } from "@/utils/api";

// Creates and revokes user invitations
export async function POST(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const requestType = searchParams.get("requestType") as "create" | "revoke";
  const organizationId = searchParams.get("organizationId") as string;

  if (requestType === "create") {
    const invitationType = searchParams.get("invitationType") as
      | "single"
      | "multi";
    const inviterUserId = searchParams.get("inviterUserId") as string;
    const emailAddress = searchParams.get("emailAddress") as string;
    const role = searchParams.get("role") as string; // as Role;

    if (invitationType === "single") {
      const invite: PostResponse = await client.organizations
        .createOrganizationInvitation({
          organizationId,
          inviterUserId,
          emailAddress,
          role,
          // redirectUrl: `/sign-up?emailAddress=${emailAddress}`, // TODO
        })
        .then(() => {
          // console.log(invitation);
          // const invitationId = invitation.id;
          return {
            status: 200,
            success: true,
            message: {
              title: "User successfully invited ✅",
              description: `An email was sent to ${emailAddress} with instructions to join this organization.`,
            },
          };
        })
        .catch((err) => {
          const error: InvitationError = err.errors[0];
          console.error(err);
          return {
            status: parseInt(error.code),
            success: false,
            message: {
              title: "Error inviting user",
              description: error.longMessage,
            },
          };
        });

      return NextResponse.json(invite);
    } else if (invitationType === "multi") {
      const body = await request.json();

      const successEmails: string[] = [];
      const failureEmails: string[] = [];

      // const failures: Failure[] = [];

      for (const user of body) {
        const emailAddress: string = user.emailAddress;
        const role: string = user.role;

        await client.organizations
          .createOrganizationInvitation({
            organizationId,
            inviterUserId,
            emailAddress,
            role: `org:${role.toLowerCase()}`,
            // redirectUrl: `/sign-up?emailAddress=${emailAddress}`, // TODO
          })
          .then(() => {
            // console.log(invitation); // requres .then((invitation) => {...
            // const invitationId = invitation.id;
            successEmails.push(emailAddress);
          })
          .catch((error) => {
            console.error(error);
            failureEmails.push(emailAddress);
            // const failure = {
            //   status: error.status,
            //   success: false,
            //   message: {
            //     title: "Error inviting user",
            //     description: error.errors[0].longMessage,
            //   },
            // };
            // failures.push(failure);
          });
      }

      const response: InvitationResponse = {
        status: successEmails.length > 0 ? 200 : 400,
        success: successEmails.length > 0,
        invitations: {
          sent: successEmails.length,
          failed: failureEmails.length,
        },
        message: {
          title:
            successEmails.length > 0
              ? failureEmails.length > 0
                ? "Some users were successfully invited."
                : "Users successfully invited ✅"
              : "Error inviting users",
          description: `${
            successEmails.length > 0
              ? `An email was sent to ${
                  successEmails.length <= 3
                    ? listItemsAsString(successEmails)
                    : `${successEmails.length} ${
                        successEmails.length === 1 ? "user" : "users"
                      }`
                } with instructions to join this organization.`
              : ""
          }${
            successEmails.length === 0
              ? "None of the emails could be sent an invitation."
              : failureEmails.length > 0
              ? `${failureEmails.length} ${
                  failureEmails.length === 1 ? "email wasn't" : "emails weren't"
                } able to be invited.`
              : ""
          }`,
        },
      };

      // const success: Success = {
      //   status: 200,
      //   success: true,
      //   message: {
      //     title: "Users successfully invited ✅",
      //     description: `${
      //       successEmails.length > 0
      //         ? `An email was sent to ${
      //             successEmails.length <= 3
      //               ? listItemsAsString(successEmails)
      //               : `${successEmails.length} ${
      //                   successEmails.length === 1 ? "user" : "users"
      //                 }`
      //           } with instructions to join this organization.`
      //         : ""
      //     }${
      //       failureEmails.length > 0
      //         ? `${failureEmails.length} ${
      //             failureEmails.length === 1 ? "email wasn't" : "emails weren't"
      //           } able to be invited.`
      //         : ""
      //     }`,
      //   },
      // };

      return NextResponse.json(response);
    } else
      return NextResponse.json({
        status: 400,
        success: false,
        message: {
          title: "Error inviting users",
          description: "Bad request. Please try again.",
        },
      });
  } else if (requestType === "revoke") {
    const invitationId = searchParams.get("invitationId") as string;
    const body = await request.json();
    const requestingUserId = body.requestingUserId;

    const revoke: PostResponse = await client.organizations
      .revokeOrganizationInvitation({
        organizationId,
        invitationId,
        requestingUserId,
      })
      .then((invitation) => {
        // console.log(invitation);
        return {
          status: parseInt(invitation.status ?? "200"),
          success: true,
          message: {
            title: "Invitation successfully revoked ✅",
            description: `The invitation sent to ${invitation.emailAddress} is no longer valid. To invite this user in the future, send them another invite.`,
          },
        };
      })
      .catch((err) => {
        const error: InvitationError = err.errors[0];
        console.error(err);
        return {
          status: parseInt(error.code),
          success: false,
          message: {
            title: "Error revoking user",
            description: error.longMessage,
          },
        };
      });

    return NextResponse.json(revoke);
  } else {
    return NextResponse.json({
      status: 422,
      success: false,
      message: {
        title: "Invalid request",
        description: "This request is invalid. Please try again.",
      },
    });
  }
}

// Reads list of user invitations
export async function GET(request: NextRequest) {
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId") as string;

  const invitations: PostResponse = await client.organizations
    .getOrganizationInvitationList({
      organizationId,
    })
    .then((org) => {
      return {
        status: 200,
        success: true,
        data: org.data,
        totalCount: org.totalCount,
        message: {
          title: "Woohoo!",
          description:
            "Your organization's pending invitations were successfully loaded.",
        },
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        status: 400,
        success: false,
        data: null,
        totalCount: null,
        message: {
          title: "Uh-oh",
          description:
            "We couldn't fetch your organization's pending invitations. Please try again.",
        },
      };
    });

  return NextResponse.json(invitations);
}
