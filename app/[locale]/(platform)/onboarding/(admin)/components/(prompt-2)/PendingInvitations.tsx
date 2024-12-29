"use client";

import { Button } from "@/components/ui/button";
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
import {
  DEFAULT_INVITATIONS_LIST_RES,
  generateQueryString,
  InvitationsListResponse,
} from "@/utils/api";
import { properString, truncateEmail } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMediaQuery } from "usehooks-ts";
import { formatRelative } from "date-fns";
import { MdEmail } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { toast } from "@/hooks/use-toast";

export default function PendingInvitations() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-muted-foreground p-0">
            View pending invitations
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pending invitations</DialogTitle>
            <DialogDescription>
              View and manage pending invitations here.
            </DialogDescription>
          </DialogHeader>
          <PendingInvitationsList />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-muted-foreground p-0">
          View pending invitations
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90dvh] overflow-y-auto">
        <DrawerHeader className="text-left px-5">
          <DrawerTitle>Pending invitations</DrawerTitle>
          <DrawerDescription>
            View and manage pending invitations here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <PendingInvitationsList />
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

function PendingInvitationsList() {
  const { user, isLoaded } = useUser();
  const { setIsLoading } = useOnboardingContext();

  const [invitationsData, setInvitationsData] =
    useState<InvitationsListResponse>();

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const totalCount = invitationsData?.data?.filter(
    (invitation) => invitation.status === "pending"
  ).length;

  const adminCount = invitationsData?.data?.filter(
    (invitation) =>
      invitation.status === "pending" && invitation.role === "org:admin"
  ).length;
  const teacherCount = invitationsData?.data?.filter(
    (invitation) =>
      invitation.status === "pending" && invitation.role === "org:teacher"
  ).length;

  const getInvitations = async (): Promise<InvitationsListResponse> => {
    if (!user) return DEFAULT_INVITATIONS_LIST_RES;
    const organizationId = user.organizationMemberships[0].organization.id;
    const queryString = await generateQueryString([{ organizationId }]);

    const invitations = await fetch(
      `/api/organizations/invite-users?${queryString}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((json: InvitationsListResponse) => {
        console.log(json);
        return json;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });

    return invitations;
  };

  const resendInvitation = async (emailAddress: string, role: string) => {
    if (!user) return;
    setIsLoading(true);
    const organizationId = user.organizationMemberships[0].organization.id;
    const inviterUserId = user.id;

    const queryString = await generateQueryString([
      { requestType: "create" },
      { invitationType: "single" },
      { organizationId },
      { inviterUserId },
      { emailAddress },
      { role },
    ]);

    await fetch(`/api/organizations/invite-users?${queryString}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        toast({
          variant: json.success ? "default" : "destructive",
          title: json.message.title,
          description: json.message.description,
        });

        setIsLoading(false);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Error inviting user",
          description: err.message,
        });
        setIsLoading(false);
      });
  };

  const revokeInvitation = async (invitationId: string) => {
    if (!user) return;
    setIsLoading(true);
    const organizationId = user.organizationMemberships[0].organization.id;
    const requestingUserId = user.id;

    const queryString = await generateQueryString([
      { requestType: "revoke" },
      { invitationType: "single" },
      { organizationId },
      { invitationId },
    ]);

    const body = JSON.stringify({
      requestingUserId,
    });

    await fetch(`/api/organizations/invite-users?${queryString}`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        toast({
          variant: "default",
          title: json.message.title,
          description: json.message.description,
        });
        setIsLoading(false);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: err.message.title,
          description: err.message.description,
        });
        setIsLoading(false);
      });
    // .finally(async () => {
    //   try {
    //     const invitations = await getInvitations();
    //     setInvitationsData(invitations);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });
  };

  useEffect(() => {
    const fetchAndSetInvitations = async () => {
      try {
        const invitations = await getInvitations();
        setInvitationsData(invitations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetInvitations();
  }, [lastUpdated]);

  if (!user || !isLoaded) return;
  return (
    <>
      {invitationsData && invitationsData.data ? (
        <Table className="border">
          <TableHeader>
            <TableRow className="text-xs md:text-sm">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>Invitation Date</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitationsData.data
              .filter((invitation) => invitation.status === "pending")
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((invitation, i) => (
                <TableRow key={invitation.id} className="text-xs md:text-sm">
                  <TableCell className="text-center font-medium">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-2xs md:text-xs font-medium">
                    {properString(
                      formatRelative(
                        new Date(invitation.createdAt),
                        new Date()
                        // , { locale: es } // TODO: Add locale functionality
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {truncateEmail(invitation.emailAddress, 35)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="rounded-full scale-90 md:scale-100"
                    >
                      {properString(invitation.role.slice(4))}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-center gap-3 text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        resendInvitation(
                          invitation.emailAddress,
                          invitation.role
                        )
                      }
                      className="rounded-full size-8"
                    >
                      <MdEmail className="size-full" />
                      <span className="sr-only">
                        Resend organization invitation
                      </span>
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => revokeInvitation(invitation.id)}
                      className="rounded-full size-8"
                    >
                      <FaRegTrashCan className="size-full" />
                      <span className="sr-only">
                        Revoke organization invitation
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-xs md:text-sm text-center font-semibold"
              >
                Total: {totalCount}{" "}
                {totalCount === 1 ? "invitations" : "invitations"} (
                {[
                  `${adminCount} admin`,
                  `${teacherCount} ${
                    teacherCount === 1 ? "teacher" : "teachers"
                  }`,
                ].join(", ")}
                )
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        // TODO: Make a skeleton table instead
        <div className="text-center font-semibold">Loading...</div>
      )}
    </>
  );
}
