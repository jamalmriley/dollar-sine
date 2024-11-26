"use client";

import Link from "next/link";
import Image from "next/image";
import LightLogo from "@/assets/images/ds_logo_light.png";
import DarkLogo from "@/assets/images/ds_logo_dark.png";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Search from "@/components/Search";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex gap-3 border-b justify-between px-10 py-2 items-center">
        {/* Left: Logo */}
        <div className="h-10 w-1/6">
          <Link href="/dashboard">
            <Image
              src={LightLogo}
              alt="Logo"
              className="object-contain h-10 w-10 block dark:hidden"
            />

            <Image
              src={DarkLogo}
              alt="Logo"
              className="object-contain h-10 w-10 hidden dark:block"
            />
          </Link>
        </div>

        <Search />

        {/* Right: Account Button and Toggle Buttons */}
        <div className="flex justify-end items-center gap-3 w-1/6 min-w-[124px]">
          <UserButton />
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
