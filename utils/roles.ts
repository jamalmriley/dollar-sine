import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export type Role = "student" | "guardian" | "teacher" | "admin";

export async function checkRole(roles: Roles[]): Promise<boolean> {
  const { sessionClaims } = await auth();
  for (const role of roles) {
    const isValidRole = sessionClaims?.metadata.role === role;
    if (isValidRole) return true;
  }
  return false;
}

export const BASE_PUBLIC_METADATA = {
  student: {},
  guardian: {},
  teacher: {
    displayName: null,
    role: "teacher",
    jobTitle: "",
    isOnboardingCompleted: false,
    onboardingLink: "/onboarding",
    organizations: [],
    classes: [],
    myCourses: [],
    students: [],
    profile: {
      pronouns: null,
    },
  },
  admin: {
    displayName: null,
    role: "admin",
    jobTitle: "",
    isOnboardingCompleted: false,
    onboardingLink: "/onboarding",
    organizations: [],
    classes: [],
    myCourses: [],
    students: [],
    profile: {
      pronouns: null,
    },
  },
};
