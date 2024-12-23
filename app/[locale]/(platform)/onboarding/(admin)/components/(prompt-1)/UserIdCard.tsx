"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { properString, truncateString } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { useQueryState } from "nuqs";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function UserIdCard() {
  const [pronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [jobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [displayName] = useQueryState("displayName", { defaultValue: "" });

  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  const role = user.publicMetadata.role as string;
  return (
    <div className="w-full flex flex-col justify-between aspect-[3.375/2.125] items-center bg-dodger-blue-50 dark:bg-woodsmoke-950 select-none overflow-hidden">
      {/* Top */}
      <div className="w-full h-7 flex justify-center items-center bg-dodger-blue-400 dark:bg-dodger-blue-950">
        <div className="w-16 h-3 bg-primary-foreground rounded-full" />
      </div>

      {/* User Info */}
      <div className="w-full flex gap-5 px-5 items-center">
        {/* User Profile Picture */}
        <div className="size-20 min-w-20 min-h-20 rounded-full border-2 overflow-hidden">
          {user && user.fullName ? (
            <img src={user?.imageUrl} alt={user?.fullName} />
          ) : (
            <Skeleton />
          )}
        </div>

        {/* User Details */}
        <div className="flex flex-col z-50">
          <p className="text-lg font-bold">
            {displayName !== "" ? displayName : user.fullName}{" "}
            {pronouns !== "" && (
              <span className="text-sm font-normal text-muted-foreground">
                ({pronouns})
              </span>
            )}
          </p>
          <p className="text-sm font-medium">{jobTitle}</p>
          <span className="flex gap-3 items-center text-xs text-muted-foreground mt-3">
            <MdEmail />
            {truncateString(user.primaryEmailAddress?.emailAddress || "", 25)}
          </span>
          <span className="flex gap-3 items-center text-xs text-muted-foreground">
            <FaKey />
            Access Level: {properString(role)}
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full h-10 flex items-center px-5 gap-2 bg-dodger-blue-400 dark:bg-dodger-blue-950">
        <div className="rounded-sm overflow-hidden">
          <img
            src={user.organizationMemberships[0].organization.imageUrl}
            alt={user.organizationMemberships[0].organization.name}
            width={24}
            height={24}
          />
        </div>
        <span className="text-xs font-bold uppercase">
          {user.organizationMemberships[0].organization.name}
        </span>
      </div>

      {/* Top SVG Background */}
      {/* <div className="custom-shape-divider-top-1733810752">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div> */}

      {/* Bottom SVG Background */}
      {/* <div className="custom-shape-divider-bottom-1733811252">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="shape-fill"
          ></path>
        </svg>
      </div> */}
    </div>
  );
}
