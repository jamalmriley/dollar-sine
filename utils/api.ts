import { EmailAddress } from "@clerk/nextjs/server";

// —————————— DATA —————————— //

export type UserData = {
  createdAt: number;
  emailAddresses: EmailAddress[];
  firstName: string | null;
  id: string;
  imageUrl: string;
  lastName: string | null;
  publicMetadata: any;
};

export type OrgData = {
  createdAt: number;
  createdBy: string;
  id: string;
  imageUrl: string;
  maxAllowedMemberships: number;
  name: string;
  publicMetadata: OrgMetadata;
  slug: string;
};

export type ProfileMetadata = {
  prefix: string;
  displayName: string;
  displayNameFormat: string;
  jobTitle: string;
  pronouns: string;
  skinTone: string;
};

export type OrgMetadata = {
  organizationAddress: string;
  is2FARequired: boolean;
};

// —————————— RESPONSES —————————— //

export type PostResponse = {
  status: number;
  success: boolean;
  message: { title: string; description?: string };
};

export type GetResponse = {
  status: number;
  success: boolean;
  data: any;
  message: { title: string; description?: string };
};

export type InvitationResponse = {
  status: number;
  success: boolean;
  invitations: { sent: number; failed: number };
  message: {
    title: string;
    description: string;
  };
};

export type InvitationError = {
  message: string;
  longMessage: string;
  code: string;
  meta: {};
};

export type InvitationDataItem = {
  createdAt: number;
  emailAddress: string;
  id: string;
  organizationId: string;
  privateMetadata: {};
  publicMetadata: {};
  role: string;
  status: string;
  updatedAt: number;
};

export type InvitationsListResponse = {
  status: number;
  success: boolean;
  data: InvitationDataItem[] | null;
  totalCount: number | null;
  message: {
    title: string;
    description: string;
  };
};

export const DEFAULT_INVITATIONS_LIST_RES: InvitationsListResponse = {
  status: 400,
  success: false,
  data: null,
  totalCount: null,
  message: {
    title: "Uh-oh",
    description:
      "You don't have access to view this organization's pending invitations.",
  },
};

export const generateQueryString = (queryParams: any[]) => {
  const result = [];
  for (const obj of queryParams) {
    for (const [key, value] of Object.entries(obj)) {
      result.push(`${key}=${value}`);
    }
  }
  return result.join("&");
};
