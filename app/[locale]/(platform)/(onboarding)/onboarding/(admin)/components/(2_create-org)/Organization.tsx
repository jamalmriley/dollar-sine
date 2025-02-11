"use client";

import { useUser } from "@clerk/nextjs";
import CreateOrUpdateOrg from "./CreateOrUpdateOrg";
import OrgAlreadyCreated from "./OrgAlreadyCreated";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Organization() {
  const { setOrgLogo, isUpdatingOrg, setIsUpdatingOrg } =
    useOnboardingContext();

  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });

  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });

  const [is2FARequired, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

  const header = {
    title: isUpdatingOrg
      ? "Update your organization."
      : isCreateOrgCompleted()
      ? "Organization successfully created!"
      : "Create your organization.",
    description: "",
    // description: isUpdatingOrg
    //   ? "Need to make a quick edit? Update your organization's details below."
    //   : isCreateOrgCompleted()
    //   ? "View your organization's details below."
    //   : "Enter your organization's details below.",
  };

  return (
    <Card
      className={`w-full h-full mx-10 ${
        isUpdatingOrg ? "max-w-3xl" : "max-w-lg"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
          {isUpdatingOrg && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setIsUpdatingOrg(false);
                setOrgName("");
                setOrgAddress("");
                setOrgSlug("");
                setOrgLogo(undefined);
                setIs2FARequired(false);
              }}
            >
              <span className="sr-only">Cancel updating my organization</span>
              <MdClose />
            </Button>
          )}
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {isUpdatingOrg ? (
          <CreateOrUpdateOrg />
        ) : isCreateOrgCompleted() ? (
          <OrgAlreadyCreated />
        ) : (
          <CreateOrUpdateOrg />
        )}
      </CardContent>
    </Card>
  );
}

export const isCreateOrgCompleted = (): boolean => {
  const { user } = useUser();
  if (!user) return false;
  return user.organizationMemberships.length > 0;
};
