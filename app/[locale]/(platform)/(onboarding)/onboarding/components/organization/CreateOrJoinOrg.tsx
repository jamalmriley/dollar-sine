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
import { useEffect, useState } from "react";
import CreateOrg from "./CreateOrg";
import JoinOrg from "./JoinOrg";
import { getUser } from "@/app/actions/onboarding";
import { User } from "@clerk/nextjs/server";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function CreateOrJoinOrg() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    hasInvitations,
    lastUpdated,
    setOrgLogo,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  const [, setOrgName] = useQueryState("orgName", { defaultValue: "" });
  const [, setOrgSlug] = useQueryState("orgSlug", { defaultValue: "" });
  const [, setOrgCategory] = useQueryState("orgCategory", { defaultValue: "" });
  const [, setIsCustomOrgCategory] = useQueryState(
    "isCustomOrgCategory",
    parseAsBoolean.withDefault(false)
  );
  const [, setOrgAddress] = useQueryState("orgAddress", { defaultValue: "" });
  const [, setIsTeacherPurchasingEnabled] = useQueryState(
    "isTeacherPurchasingEnabled",
    parseAsBoolean.withDefault(false)
  );

  const userMetadata = user?.publicMetadata as any as UserMetadata;

  const [tab, setTab] = useState(
    userMetadata.role === "admin" ? "create" : "join"
  );

  const currStep = 2;
  const metadata = user?.publicMetadata as any as UserMetadata;
  const initIsCompleted = metadata.lastOnboardingStepCompleted >= currStep;
  const [isCompleted, setIsCompleted] = useState<boolean>(initIsCompleted);

  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= 2 &&
    currOnboardingStep.step === 2 &&
    currOnboardingStep.isEditing;

  const createHeader = {
    title: isUpdating
      ? "Update your organization."
      : isCompleted
        ? "Organization successfully created!"
        : "Create your organization.",
    description: isUpdating
      ? "Need to make a quick edit? Update your organization's details below."
      : isCompleted
        ? "View your organization's details below."
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

  function handleCancelForm(): void {
    setOrgName("");
    setOrgSlug("");
    setOrgCategory("");
    setIsCustomOrgCategory(false);
    setOrgAddress("");
    setIsTeacherPurchasingEnabled(false);
    setOrgLogo(undefined);
    setCurrOnboardingStep({ step: 2, isEditing: false });
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(user?.id);
        const userData = JSON.parse(res.data) as User;
        const publicMetadata = userData.publicMetadata as any as UserMetadata;
        setIsCompleted(publicMetadata.lastOnboardingStepCompleted >= currStep);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isCompleted) fetchUser();
  }, [lastUpdated]);

  if (!user || !isLoaded) return;
  return (
    <div className="size-full flex justify-center">
      <Card
        className={`h-fit mx-10 expandable-content ${tab === "join" ? "max-w-lg" : "max-w-3xl"}`}
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
                onClick={() => handleCancelForm()}
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
            <TabsList className="grid w-72 grid-cols-2 select-none mx-auto mb-5">
              <TabsTrigger
                value="create"
                disabled={hasInvitations}
                className={`${tab === "create" && "border-r border-default-color"}`}
              >
                Create
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className={`${tab === "join" && "border-l border-default-color"}`}
                onClick={() => handleCancelForm()}
              >
                Join
              </TabsTrigger>
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
