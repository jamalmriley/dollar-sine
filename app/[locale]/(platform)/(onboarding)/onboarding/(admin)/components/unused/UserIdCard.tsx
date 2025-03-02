"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { properString, truncateEmail } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { FaBuilding, FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function UserIdCard() {
  const [pronouns] = useQueryState("pronouns", { defaultValue: "" });
  const [jobTitle] = useQueryState("jobTitle", { defaultValue: "" });
  const [displayName] = useQueryState("displayName", { defaultValue: "" });

  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  const role = user.publicMetadata.role as string;
  return (
    <div className="size-full flex flex-col justify-between items-center bg-dodger-blue-50 dark:bg-woodsmoke-950 select-none overflow-hidden">
      {/* Top */}
      <div className="w-full h-5 flex justify-center items-center bg-dodger-blue-400 dark:bg-dodger-blue-950">
        <div className="w-12 h-2 bg-primary-foreground rounded-full" />
      </div>

      {/* User Info */}
      <div className="w-full flex gap-3 px-3 items-center">
        {/* User Profile Picture */}
        <div className="size-14 min-w-14 min-h-14 rounded-full border-2 overflow-hidden">
          {user && user.fullName ? (
            <Image
              src={user.imageUrl}
              width={56}
              height={56}
              alt={user.fullName}
              loading="eager"
              className="overflow-hidden"
            />
          ) : (
            <Skeleton />
          )}
        </div>

        {/* User Details */}
        <div className="flex flex-col">
          <p className="text-sm font-bold">
            {displayName !== "" ? displayName : user.fullName}{" "}
            {pronouns !== "" && (
              <span className="text-xs font-normal text-muted-foreground">
                ({pronouns})
              </span>
            )}
          </p>
          <p className="text-xs font-medium">{jobTitle}</p>
          <span className="flex gap-2 items-center text-2xs text-muted-foreground mt-2">
            <MdEmail />
            {truncateEmail(user.primaryEmailAddress?.emailAddress || "", 5)}
          </span>

          <span className="flex gap-2 items-center text-2xs text-muted-foreground">
            <FaBuilding />
            {user.organizationMemberships[0].organization.name}
          </span>

          <span className="flex gap-2 items-center text-2xs text-muted-foreground">
            <FaKey />
            Role: {properString(role)}
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full h-3 bg-dodger-blue-400 dark:bg-dodger-blue-950" />
    </div>
  );
}
