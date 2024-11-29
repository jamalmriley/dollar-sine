import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export async function checkRole(roles: Roles[]): Promise<boolean> {
  const { sessionClaims } = await auth();
  for (const role of roles) {
    const isValidRole = sessionClaims?.metadata.role === role;
    if (isValidRole) return true;
  }
  return false;
}
