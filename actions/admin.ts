"use server";

import { getCurrentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const getAdmin = async () => {
  const role = await getCurrentRole();

  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden" };
};
