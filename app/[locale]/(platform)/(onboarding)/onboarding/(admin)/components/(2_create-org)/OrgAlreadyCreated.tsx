"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { GetResponse, OrgData } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { OrgCard, OrgCardError, OrgCardSkeleton } from "./OrgCard";

export default function OrgAlreadyCreated() {
  const { user, isLoaded } = useUser();
  const { lastUpdated, isLoading, setIsLoading } = useOnboardingContext();
  const [toggle, setToggle] = useState(false);
  const [orgData, setOrgData] = useState<OrgData>();
  const organization = user?.organizationMemberships[0].organization;

  const getOrg = async (): Promise<any> => {
    const fetchedOrg = await fetch(
      `/api/organizations/get?organizationId=${organization?.id}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((json: GetResponse) => {
        // console.log(json)
        return json.data;
      });
    // .catch((err) => {
    //   console.error(err);
    //   return err;
    // });

    return fetchedOrg;
  };

  useEffect(() => {
    const fetchAndSetOrg = async () => {
      setIsLoading(true);
      try {
        const orgData = await getOrg();
        setOrgData(orgData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetOrg();
  }, [lastUpdated]);

  if (!organization || !isLoaded) return;
  return (
    <div className="flex flex-col border border-default-color rounded-lg overflow-hidden">
      {/*
      If the org has loaded and there is data, display the OrgCard component.
      If the org has loaded and there is no data, display the OrgCardError component.
      If the org has not loaded yet, display the OrgCardSkeleton component.
      */}
      {!isLoading ? (
        orgData ? (
          <OrgCard toggle={toggle} orgData={orgData} />
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
  );
}
/*
  transition: height 0.4s ease;
  padding: 0px 20px;
  overflow: hidden;
*/
