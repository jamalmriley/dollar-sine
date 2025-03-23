"use server";

import { CourseData } from "@/types/course";
import { Response } from "@/types/general";
import {
  AdminMetadata,
  GuardianMetadata,
  OrganizationMetadata,
  StudentMetadata,
  TeacherMetadata,
} from "@/types/user";
import { db } from "@/utils/firebase";
import { clerkClient } from "@clerk/nextjs/server";
import { collection, getDocs, query } from "firebase/firestore";
import { revalidatePath } from "next/cache";

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

// Get user
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
    | null
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
      const title = "Profile successfully updated ✅";
      const description = "";

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
  metadata: OrganizationMetadata
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

// Get organization
export async function getOrganization(
  organizationId: string | undefined
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required organization ID",
      description:
        "An organization ID is required to retrieve the user's profile.",
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

// Update organization
export async function updateOrganization(
  organizationId: string,
  metadata: OrganizationMetadata
): Promise<Response> {
  const client = await clerkClient();
  const { name, slug } = metadata;
  const publicMetadata = metadata as any as OrganizationPublicMetadata;

  const update: Response = await client.organizations
    .updateOrganization(organizationId, { name, slug, publicMetadata })
    .then(() => {
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

// Read Courses
export async function getCourses(): Promise<Response> {
  const q = query(
    collection(db, "courses")
    // where("publishDate", ">=", new Date()) // TODO
  );

  const result: CourseData[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as CourseData;
    result.push(data);
  });

  return {
    status: result.length ? 200 : 400,
    success: Boolean(result.length),
    data: JSON.stringify(result), // Only plain objects can be passed to Client Components from Server Components, so manually conversion is required.
  };
}
