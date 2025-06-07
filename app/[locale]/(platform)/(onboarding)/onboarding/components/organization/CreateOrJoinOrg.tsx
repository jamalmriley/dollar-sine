import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { UserMetadata } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { MdClose } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import CreateOrg from "./CreateOrg";
import JoinOrg from "./JoinOrg";

export default function CreateOrJoinOrg() {
  const { currOnboardingStep, setCurrOnboardingStep } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const userMetadata = user?.publicMetadata as any as UserMetadata;

  const [tab, setTab] = useState(
    userMetadata.role === "admin" ? "create" : "join"
  );

  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= 2 &&
    currOnboardingStep.step === 2 &&
    currOnboardingStep.isEditing;

  const createHeader = {
    title: isUpdating
      ? "Update your organization."
      : "Create your organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your organization's details below."
      : "Enter your organization's details below.",
  };

  const joinHeader = {
    title: isUpdating
      ? "Update your join request."
      : "Request to join an organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your request to join an organization below."
      : "Search an organization to request joining it.",
  };

  if (!user || !isLoaded) return;
  return (
    <div className="size-full flex justify-center">
      <Card
        className={`mx-10 expandable-content ${tab === "join" ? "max-w-lg" : "max-w-3xl"}`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="h2">
              {tab === "join" ? joinHeader.title : createHeader.title}
            </CardTitle>
            {isUpdating && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-5 lg:size-6"
                onClick={() => {
                  setCurrOnboardingStep({ step: 2, isEditing: false });
                  // setOrgName("");
                  // setOrgToJoin("");
                  // setOrgSlug("");
                  // setOrgLogo(undefined);
                  // setIsTeacherPurchasingEnabled(false);
                }}
              >
                <span className="sr-only">Cancel updating my join request</span>
                <MdClose />
              </Button>
            )}
          </div>

          <CardDescription className="subtitle">
            {tab === "join" ? joinHeader.description : createHeader.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateOrg />
            </TabsContent>
            <TabsContent
              value="join"
              className="size-full flex flex-col justify-center"
            >
              <JoinOrg />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
