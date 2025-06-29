"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { Course } from "@/types/course";
import { Response } from "@/types/general";
import {
  AdminMetadata,
  GuardianMetadata,
  OrganizationMetadata,
  StudentMetadata,
  TeacherMetadata,
  UserMetadata,
} from "@/types/user";
import { db } from "@/utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import dotenv from "dotenv";
dotenv.config();

interface ClerkError {
  message: string;
  long_message: string;
  code: string;
  meta: any;
  clerk_trace_id: string;
}

export interface ClerkErrorResponse {
  errors: ClerkError[];
  meta: any;
  clerk_trace_id: string;
}

export async function getPronunciations(
  name: string,
  valuesToIgnore?: string[]
): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY as string;
  const ai = new GoogleGenAI({ apiKey });

  const pronunciation: Response = await ai.models
    .generateContent({
      model: "gemini-2.0-flash",
      contents: `Provide a comma-separated list of up to 3 unique pronunciation respellings for the name "${name}". Only provide the string and omit any additional text in the response, including any line breaks. Each comma should be followed by one space, and each syllable should either be fully uppercase or fully lowercase. For example, a valid pronunciation respelling for "Jamal Riley" is "juh-MAHL RY-lee", where each syllable (i.e juh, MAHL, RY, lee) is spelled as it sounds and is either fully uppercase or fully lowercase. An example of an invalid pronunciation respelling for "Jamal Riley" is "Juh-MAHL RY-lee". While each syllable (i.e Juh, MAHL, RY, lee) is spelled as it sounds, one of the syllables (i.e. "Juh") is not fully uppercase or lowercase.${
        valuesToIgnore &&
        valuesToIgnore.length > 0 &&
        ` If possible, do not return the following values as a part of the list: ${valuesToIgnore.join(
          ", "
        )}`
      }`,
    })
    .then((res) => {
      return {
        status: 200,
        success: true,
        data: res.text ? res.text.replace(/\n/g, "") : undefined,
      };
    })
    .catch((err) => {
      console.error("error:", typeof err);
      return {
        status: 400,
        success: false,
      };
    });

  return pronunciation;
}

// Read user
export async function getUser(userId: string | undefined): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required user ID",
      description: "A user ID is required to retrieve the user's profile.",
    },
  };
  if (!userId) return invalidRes;

  const client = await clerkClient();

  const user: Response = await client.users
    .getUser(userId)
    .then((user) => {
      const data = JSON.stringify(user);
      return {
        status: 200,
        success: true,
        data,
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        data: {},
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  return user;
}

// Update user public metadata
export async function updateUserMetadata(
  userId: string,
  metadata:
    | AdminMetadata
    | TeacherMetadata
    | GuardianMetadata
    | StudentMetadata
    // | UserMetadata
    | null,
  formData?: FormData
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required metadata",
      description: "User metadata is required to update the user's profile.",
    },
  };
  if (!metadata) return invalidRes;

  const client = await clerkClient();
  const publicMetadata = metadata as any as UserPublicMetadata;

  const update: Response = await client.users
    .updateUserMetadata(userId, {
      publicMetadata,
    })
    .then(() => {
      if (formData) {
        const profilePic = formData.get("profilePic") as File;
        if (profilePic) {
          client.users.updateUserProfileImage(userId, { file: profilePic });
        }
      }

      const [title, description] = ["Profile successfully updated ✅", ""];

      return {
        status: 200,
        success: true,
        message: { title, description },
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  revalidatePath("/onboarding");
  return update;
}

// Create organization
export async function createOrganization(
  createdBy: string,
  metadata: OrganizationMetadata,
  formData?: FormData
): Promise<Response> {
  const client = await clerkClient();
  const { name, slug } = metadata;
  const publicMetadata = metadata as any as OrganizationPublicMetadata;

  const create: Response = await client.organizations
    .createOrganization({
      name,
      createdBy,
      maxAllowedMemberships: 10,
      slug,
      publicMetadata,
    })
    .then((org) => {
      if (formData) {
        const orgLogo = formData.get("orgLogo") as File;
        if (orgLogo) {
          client.organizations.updateOrganizationLogo(org.id, {
            file: orgLogo,
          });
        }
      }

      const { membersCount } = org;
      setDoc(doc(db, "organizations", `${org.id}`), {
        ...org,
        membersCount: membersCount || null, // Firebase doesn't allow undefined values.
      });

      const [title, description] = ["Organization successfully created ✅", ""];

      return {
        status: 200,
        success: true,
        message: { title, description },
        data: org.id,
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  return create;
}

// Read organization
export async function getOrganizationById(
  organizationId: string | undefined
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required organization ID",
      description:
        "An organization ID is required to retrieve the organization's data.",
    },
  };
  if (!organizationId) return invalidRes;

  const client = await clerkClient();

  const org: Response = await client.organizations
    .getOrganization({ organizationId })
    .then((org) => {
      const data = JSON.stringify(org);
      return {
        status: 200,
        success: true,
        data,
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        data: {},
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  return org;
}

export async function getOrganizationBySlug(
  slug: string | undefined
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required organization slug",
      description:
        "An organization slug is required to retrieve the organization's data.",
    },
  };
  if (!slug) return invalidRes;

  const client = await clerkClient();

  const org: Response = await client.organizations
    .getOrganization({ slug })
    .then((org) => {
      const data = JSON.stringify(org);
      return {
        status: 200,
        success: true,
        data,
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        data: {},
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  return org;
}

// Update organization
export async function updateOrganization(
  organizationId: string,
  metadata: OrganizationMetadata,
  formData?: FormData
): Promise<Response> {
  const client = await clerkClient();
  const { name, slug } = metadata;
  const publicMetadata = metadata as any as OrganizationPublicMetadata;

  const update: Response = await client.organizations
    .updateOrganization(organizationId, { name, slug, publicMetadata })
    .then((org) => {
      if (formData) {
        const orgLogo = formData.get("orgLogo") as File;
        if (orgLogo) {
          client.organizations.updateOrganizationLogo(organizationId, {
            file: orgLogo,
          });
        }
      }

      const { membersCount } = org;
      setDoc(doc(db, "organizations", `${org.id}`), {
        ...org,
        membersCount: membersCount || null, // Firebase doesn't allow undefined values.
      });

      const [title, description] = ["Organization successfully updated ✅", ""];

      return {
        status: 200,
        success: true,
        message: { title, description },
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  revalidatePath("/onboarding");
  return update;
}

// Delete organization
export async function deleteOrganization(
  organizationId: string
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required organization ID",
      description: "An organization ID is required to delete an organization.",
    },
  };
  if (!organizationId) return invalidRes;

  const client = await clerkClient();
  const [title, description] = ["Organization successfully deleted ✅", ""];

  const org = await client.organizations
    .deleteOrganization(organizationId)
    .then((org) => {
      deleteDoc(doc(db, "organizations", `${org.id}`));

      const data = JSON.stringify(org);
      return {
        status: 200,
        success: true,
        data,
        message: { title, description },
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        data: {},
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  return org;
}

// Request to join or cancel joining organization
export async function sendRequestToOrganization(
  userId: string,
  userMetadata: UserMetadata,
  organizationId: string,
  organizationMetadata: OrganizationMetadata,
  requestType: "join" | "cancel"
): Promise<Response> {
  const responses: Response[] = [];

  await updateUserMetadata(userId, userMetadata).then((res) => {
    responses.push(res);
  });

  await updateOrganization(organizationId, organizationMetadata).then((res) => {
    responses.push(res);
  });

  const successCount = responses.filter((res) => res.success).length; // Should be 0, 1, or 2
  switch (successCount) {
    case 0:
      return {
        status: 400,
        success: false,
        message: {
          title: `Error ${requestType === "join" ? "requesting" : "canceling request"} to join`,
          description: responses
            .map((res) => res.message?.description)
            .join(" "),
        },
      };
    case 1:
      return responses.filter((res) => !res.success)[0];
    case 2:
      return {
        status: 200,
        success: true,
        message: {
          title: `Join request ${requestType === "join" ? "sent" : "canceled"} successfully! ✅`,
          description: "",
        },
      };
    default:
      return {
        status: 500,
        success: false,
        message: {
          title: "Internal Server Error",
          description: "Something went wrong. Please try again.",
        },
      };
  }
}

// Read Courses
export async function getCourses(): Promise<Response> {
  const q = query(
    collection(db, "courses")
    // where("publishDate", ">=", new Date()) // TODO
  );

  const result: Course[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as Course;
    result.push(data);
  });

  return {
    status: result.length ? 200 : 400,
    success: Boolean(result.length),
    data: JSON.stringify(result), // Only plain objects can be passed to Client Components from Server Components, so manually conversion is required.
  };
}
