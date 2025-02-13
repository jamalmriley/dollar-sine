"use client";

import Link from "next/link";
import { UserButton, useSession } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Search from "@/components/Search";
import CustomButton from "./CustomButton";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { SquareLogo } from "@/components/Logo";
import { Button } from "./ui/button";

export default function DashboardNavbar() {
  const { t } = useTranslation();
  const { session } = useSession();
  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex gap-3 border-b border-default-color justify-between px-10 py-2 items-center">
        {/* Left: Logo and Admin Button */}
        {/* <div className="h-10 w-1/6 min-w-[92px] flex gap-3"> */}
        <div className="h-10 w-1/6 min-w-10 flex gap-3">
          <Link href="/dashboard">
            <SquareLogo />
          </Link>
          {/* <>
            <CustomButton
              text={t("platform-layout:admin")}
              href="/admin"
              startIcon={<MdAdminPanelSettings />}
              className="hidden lg:flex"
            />

            <CustomButton
              srText={t("platform-layout:admin")}
              href="/admin"
              startIcon={<MdAdminPanelSettings />}
              className="lg:hidden"
            />
          </> */}
        </div>

        <Search />

        {/* Right: Account Button and Toggle Buttons */}
        <div className="flex justify-end items-center gap-3 w-1/6 min-w-[124px]">
          <Button
            variant="outline"
            size="icon"
            className="relative inline-block group border-0"
          >
            {/* Back */}
            <span className="absolute inset-0 size-9 transition duration-200 ease-out transform translate-x-1 translate-y-1 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md bg-black dark:bg-emerald-400" />
            {/* Front */}
            <span className="absolute inset-0 size-9 rounded-md border border-default-color bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950 overflow-hidden">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-full rounded-none",
                    userButtonAvatarBox__open: "size-full rounded-none",
                  },
                  layout: { shimmer: false },
                }}
              />
            </span>
          </Button>

          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
