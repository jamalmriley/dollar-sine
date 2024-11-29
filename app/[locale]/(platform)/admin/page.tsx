import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const isAdmin = await checkRole(["admin", "super_admin"]);
  if (!isAdmin) redirect("/dashboard");
  return (
    <div className="page-container">
      <div>organizations</div>
      <div>invite user</div>
      <div>simulate user</div>
      <div>make this page the dashboard</div>
    </div>
  );
}
