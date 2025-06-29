"use client";

import Link from "next/link";
// import { useSession } from "@clerk/nextjs";
import StyledUserButton from "@/components/StyledUserButton";
import ModeToggle from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Search from "@/components/Search";
// import { useTranslation } from "react-i18next";
import { SquareLogo } from "@/components/Logo";

export default function DashboardNavbar() {
  // const { t } = useTranslation();
  // const { session } = useSession();
  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex gap-3 border-b border-default-color justify-between px-10 py-2 items-center">
        {/* Left: Logo and Admin Button */}
        {/* <div className="h-10 w-1/6 min-w-[92px] flex gap-3"> */}
        <div className="h-10 w-1/6 min-w-10 flex gap-3">
          <Link href="/dashboard">
            <SquareLogo />
          </Link>
        </div>

        <Search />

        {/* Right: Account Button and Toggle Buttons */}
        <div className="flex justify-end items-center gap-3 w-1/6 min-w-[124px]">
          <StyledUserButton />
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
