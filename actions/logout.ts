"use server";

import { signOut } from "@/auth";

export const logOut = async () => {
  // Some server stuff, such as saving progress.
  await signOut();
};
