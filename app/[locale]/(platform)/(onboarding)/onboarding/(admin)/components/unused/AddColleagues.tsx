"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { generateQueryString, InvitationResponse } from "@/utils/api";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import FileUpload from "./FileUpload";
import UsersToInvite from "./UsersToInvite";
import PendingInvitations from "./PendingInvitations";

export default function AddColleagues() {
  const { user, isLoaded } = useUser();
  const { users, setUsers, setHasInvitedUsers } = useOnboardingContext();
  const defaultRoleVal = { label: "", value: "" };

  const [emailAddress, setEmailAddress] = useState("");
  const [role, setRole] = useState(defaultRoleVal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Teacher", value: "teacher" },
  ];

  if (!user || !isLoaded) return;

  const createSingleInvitation = async () => {
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
      { role: `org:${role.value}` },
    ]);

    await fetch(`/api/organizations/invite-users?${queryString}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setEmailAddress("");
          setRole(defaultRoleVal);
          setHasInvitedUsers(true);
        }

        toast({
          variant: json.success ? "default" : "destructive",
          title: json.message.title,
          description: json.message.description,
        });

        setIsLoading(false);
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

  const createMultipleInvitations = async () => {
    if (!user || !users) return;
    setIsLoading(true);
    const organizationId = user.organizationMemberships[0].organization.id;
    const inviterUserId = user.id;

    const queryString = await generateQueryString([
      { requestType: "create" },
      { invitationType: "multi" },
      { organizationId },
      { inviterUserId },
    ]);

    const body = JSON.stringify(users);

    await fetch(`/api/organizations/invite-users?${queryString}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => res.json())
      .then((json: InvitationResponse) => {
        setIsLoading(false);
        if (json.success) {
          setUsers(undefined);
          setHasInvitedUsers(true);
        }
        toast({
          variant: json.invitations.sent > 0 ? "default" : "destructive",
          title: json.message.title,
          description: json.message.description,
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Error inviting users",
          description: err.message,
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="h-full flex flex-col border rounded-lg p-5 bg-primary-foreground">
      <h2 className="h2">Add your colleague(s).</h2>
      {/* <span className="text-sm font-semibold text-muted-foreground">
        Note: Different accounts have different levels of access and
        permissions.
      </span> */}

      <div className="h-full flex flex-col gap-5">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Add one</TabsTrigger>
            <TabsTrigger value="multi">Add more</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Add a colleague one at a time.</CardTitle>
                <CardDescription>
                  Enter your colleague's email and select their role below.
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="email"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline">
                      {role.label === "" ? "Role" : role.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select a role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.value}
                        onClick={() => setRole(role)}
                      >
                        {role.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={
                    isLoading || emailAddress === "" || role.value === ""
                  }
                  className="flex items-center"
                  onClick={createSingleInvitation}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Inviting user...
                    </>
                  ) : (
                    <>
                      <TiUserAdd />
                      Invite user
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="multi">
            <Card>
              <CardHeader>
                <CardTitle>Add multiple colleagues from a file.</CardTitle>
                <CardDescription>
                  Use a spreadsheet to invite more users quickly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button
                  disabled={!users || isLoading}
                  className="flex items-center"
                  onClick={createMultipleInvitations}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Inviting users...
                    </>
                  ) : (
                    <>
                      <TiUserAdd />
                      Invite{" "}
                      {users
                        ? `${users.length} ${
                            users.length === 1 ? "user" : "users"
                          }`
                        : "users"}
                    </>
                  )}
                </Button>

                <UsersToInvite />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex grow justify-center">
          <PendingInvitations />
        </div>

        <Button variant="link" className="text-muted-foreground p-0">
          I'll do this later
        </Button>
      </div>

      {/* <div className="separator">
        <span className="text-sm font-semibold text-muted-foreground select-none mx-3">
          OR
        </span>
      </div> */}
    </div>
  );
}
export const isAddColleaguesCompleted = (): boolean => {
  const { hasInvitedUsers } = useOnboardingContext();
  return hasInvitedUsers;
};
