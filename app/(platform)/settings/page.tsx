import { Metadata } from "next";
import { setTitle } from "@/lib/helpers";
import { logOut } from "@/actions/logout";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = setTitle("Settings");

export default async function Settings() {
  const user = await getCurrentUser();
  const onClick = () => logOut();
  return (
    <div>
      Settings
    </div>
  );
}
