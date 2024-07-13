import { UserInfo } from "@/components/user-info";
import { getCurrentUser } from "@/lib/auth";
import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("My Profile");

export default async function MyProfile() {
  const user = await getCurrentUser();
  return <UserInfo label="My Profile" user={user} />;
}

// "use client";

// import { UserInfo } from "@/components/user-info";
// import { useCurrentUser } from "@/hooks/use-current-user";

// export default function MyProfile() {
//   const user = useCurrentUser();
//   return <UserInfo label="My Profile" user={user} />;
// }
