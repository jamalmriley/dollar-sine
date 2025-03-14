"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { OrgCard, OrgCardError, OrgCardSkeleton } from "./OrgCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrganization } from "@/app/actions/onboarding";
import { Organization } from "@clerk/nextjs/server";

export default function OrgAlreadyCreated() {
  const { user, isLoaded } = useUser();
  const { lastUpdated, isLoading, setIsLoading } = useOnboardingContext();
  const [toggle, setToggle] = useState(false);
  const [org, setOrg] = useState<Organization>();

  const organization = user?.organizationMemberships[0].organization;

  const header = {
    title: "Organization successfully created!",
    description: "View your organization's details below.",
  };

  useEffect(() => {
    const fetchAndSetOrg = async () => {
      setIsLoading(true);
      try {
        const res = await getOrganization(organization?.id);
        const org = JSON.parse(res.data) as Organization;

        setOrg(org);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetOrg();
  }, [lastUpdated]);

  if (!user || user.organizationMemberships.length === 0 || !isLoaded) return;
  return (
    <Card className="w-full h-full mx-10 max-w-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="h2">{header.title}</CardTitle>
        </div>
        {header.description !== "" && (
          <CardDescription className="subtitle">
            {header.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col border border-default-color rounded-lg overflow-hidden">
          {/*
      If the org has loaded and there is data, display the OrgCard component.
      If the org has loaded and there is no data, display the OrgCardError component.
      If the org has not loaded yet, display the OrgCardSkeleton component.
      */}
          {!isLoading ? (
            org ? (
              <OrgCard toggle={toggle} org={org} />
            ) : (
              <OrgCardError toggle={toggle} />
            )
          ) : (
            <OrgCardSkeleton toggle={toggle} />
          )}

          <Button
            variant="ghost"
            className="bg-primary-foreground rounded-none border-t border-default-color"
            onClick={() => setToggle((prev) => !prev)}
          >
            <span className="sr-only">
              {toggle
                ? "Show less organization details"
                : "Show more organization details"}
            </span>
            {toggle ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
/*
  transition: height 0.4s ease;
  padding: 0px 20px;
  overflow: hidden;
*/
