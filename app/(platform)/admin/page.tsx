"use client";

import { getAdmin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function Admin() {
  const onServerActionClick = () => {
    getAdmin().then((data) => {
      if (data.success) {
        toast.success(data.success);
      } else {
        toast.error(data.error);
      }
    });
  };
  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed API route");
      } else {
        toast.error("Forbidden API route");
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin Console</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
          <FormSuccess message="You are an admin of this website." />
        </RoleGate>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
