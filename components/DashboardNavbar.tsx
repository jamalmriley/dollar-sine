"use client";

import Link from "next/link";
import Image from "next/image";
import LightLogo from "@/assets/images/ds_logo_light.png";
import DarkLogo from "@/assets/images/ds_logo_dark.png";
// import { Search } from "@/components/Search";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";

export default function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b border-black/10 dark:border-white/10 justify-between px-10 py-2 items-center">
        {/* Logo */}
        <div className="h-10 flex">
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
        {/* <Search /> */}
        {/* Right Side */}
        <div className="flex justify-end items-center gap-3">
          <UserButton />
          <ModeToggle />
          {/* <LanguageToggle /> */}

          <div className="flex md:hidden">{/* <MenuToggle /> */}</div>
        </div>
      </div>
    </nav>
  );
}
