import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { properString, truncateEmail } from "@/utils/general";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";

export default function UsersToInvite() {
  const [open, setOpen] = useState(false);
  const { users } = useOnboardingContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!users) return;
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-muted-foreground p-0">
            View {users.length} {users.length === 1 ? "user" : "users"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Invite {users.length} {users.length === 1 ? "user" : "users"} to
              Dollar Sine.
            </DialogTitle>
            <DialogDescription>View users below.</DialogDescription>
          </DialogHeader>
          <UsersToInviteTable />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-muted-foreground p-0">
          View {users.length} {users.length === 1 ? "user" : "users"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90dvh] overflow-y-auto">
        <DrawerHeader className="text-left px-5">
          <DrawerTitle>
            Invite {users.length} {users.length === 1 ? "user" : "users"} to
            Dollar Sine.
          </DrawerTitle>
          <DrawerDescription>View users below.</DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <UsersToInviteTable />
        </div>
        <DrawerFooter className="pt-3 px-5">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function UsersToInviteTable() {
  const { users } = useOnboardingContext();
  const adminCount = users?.filter((user) => user.role === "org:admin").length;
  const teacherCount = users?.filter(
    (user) => user.role === "org:teacher"
  ).length;
  if (!users) return;
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">#</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead className="text-center">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, i) => (
          <TableRow key={i}>
            <TableCell className="text-center font-medium">{i + 1}</TableCell>
            <TableCell>{truncateEmail(user.emailAddress, 35)}</TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary" className="rounded-full">
                {properString(user.role.slice(4))}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-center font-semibold">
            Total: {users.length} {users.length === 1 ? "user" : "users"} (
            {[
              `${adminCount} admin`,
              `${teacherCount} ${teacherCount === 1 ? "teacher" : "teachers"}`,
            ].join(", ")}
            )
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
