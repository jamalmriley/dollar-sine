import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { MdClose } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CreateOrg from "./CreateOrg";
import JoinOrg from "./JoinOrg";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function CreateOrJoinOrg() {
  const {
    currOnboardingStep,
    setCurrOnboardingStep,
    hasInvitations,
    hasOrg,
    setOrgLogo,
    userMetadata,
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
  const [tab, setTab] = useState<string>("create");
  const currStep = 2;

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
    const stored = localStorage.getItem("createOrJoin");
    if (stored) {
      setTab(stored);
    } else if (userMetadata?.role) {
      setTab(userMetadata.role === "admin" ? "create" : "join");
    }
  }, [userMetadata]);

  if (!user || !isLoaded || !userMetadata) return;
  // Variables dependent on userMetadata go below the if guard.
  const isCompleted = userMetadata.lastOnboardingStepCompleted >= currStep;
  const isUpdating =
    userMetadata.lastOnboardingStepCompleted >= currStep &&
    currOnboardingStep.step === currStep &&
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
          <Tabs
            value={tab}
            onValueChange={(val) => {
              setTab(val);
              localStorage.setItem("createOrJoin", val);
            }}
            className="w-full"
          >
            <TabsList className="grid w-72 grid-cols-2 select-none mx-auto mb-5">
              <TabsTrigger
                value="create"
                className={`${tab === "create" && "border-r border-default-color"}`}
                disabled={hasInvitations}
              >
                Create
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className={`${tab === "join" && "border-l border-default-color"}`}
                onClick={() => handleCancelForm()}
                disabled={hasOrg}
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
