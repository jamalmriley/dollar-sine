"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { truncateString } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdLink } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { TbAuth2Fa } from "react-icons/tb";

export default function OrgAlreadyCreated() {
  const { user, isLoaded } = useUser();
  const { setIsUpdatingOrg } = useOnboardingContext();
  const organization = user?.organizationMemberships[0].organization;
  const [toggle, setToggle] = useState(false);

  const [orgName, setOrgName] = useQueryState("orgName", {
    defaultValue: "",
  });

  const [orgSlug, setOrgSlug] = useQueryState("orgSlug", {
    defaultValue: "",
  });

  const [orgAddress, setOrgAddress] = useQueryState("orgAddress", {
    defaultValue: "",
  });

  const [is2FARequired, setIs2FARequired] = useQueryState(
    "is2FARequired",
    parseAsBoolean.withDefault(false)
  );

  function splitAddress(address: string) {
    const separator = ",";
    const addressArr = address.split(separator);

    let address1: string = addressArr[0].trim();
    let address2: string = [...addressArr].slice(1).join(separator).trim();

    return { address1, address2 };
  }

  if (!organization || !isLoaded) return false;
  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      {/* Org Content */}
      <div className="p-5 w-full">
        <div
          className={`expandable-content ${
            toggle ? "h-32" : "h-24"
          } flex gap-5 select-none`}
        >
          {/* Org Image */}
          <img
            src={organization.imageUrl}
            alt={organization.name}
            className="aspect-square h-full rounded-lg overflow-hidden"
          />

          {/* Org Details */}
          <div className="flex grow flex-col justify-between">
            {/* Org Basic Details */}
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-center">
                <span className="text-lg font-bold">{organization.name}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setIsUpdatingOrg(true);
                    setOrgName(organization.name);
                    setOrgAddress(
                      String(organization.publicMetadata.organizationAddress)
                    );
                    setOrgSlug(organization.slug);
                    setIs2FARequired(
                      Boolean(organization.publicMetadata.is2FARequired)
                    );
                  }}
                >
                  <span className="sr-only">Edit organization</span>
                  <MdEdit />
                </Button>
              </div>
              <span className="text-sm">
                {truncateString(
                  splitAddress(
                    String(organization.publicMetadata.organizationAddress)
                  ).address1,
                  40
                )}
              </span>
              <span className="text-sm">
                {truncateString(
                  splitAddress(
                    String(organization.publicMetadata.organizationAddress)
                  ).address2,
                  40
                )}
              </span>
            </div>

            {/* Org Expanded Details and Creation Date */}
            <div className="flex flex-col">
              {/* Org Expanded Details */}
              <div
                className={`flex flex-col expandable-content overflow-hidden ${
                  toggle ? "h-10" : "h-0"
                }`}
              >
                <span className="flex items-center text-xs text-muted-foreground hover:underline">
                  <IoMdLink className="size-5 mr-2" />
                  dollarsi.ne/{organization.slug}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  <TbAuth2Fa className="size-5 mr-2" />
                  <span>
                    {Boolean(organization.publicMetadata.is2FARequired)
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </span>
              </div>

              {/* Creation Date */}
              <span className="text-xs text-muted-foreground">
                Created{" "}
                {formatRelative(
                  new Date(organization.createdAt),
                  new Date()
                  // , { locale: es } // TODO: Add locale functionality
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="rounded-none border-t"
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
