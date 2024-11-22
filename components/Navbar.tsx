"use client";

import Image from "next/image";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { FaBuilding } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import { ModeToggle } from "@/components/ModeToggle";
import LightLogo from "@/assets/images/ds_logo_light.png";
import DarkLogo from "@/assets/images/ds_logo_dark.png";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const navLinks = [
    { name: t("home"), href: "/", icon: <GoHomeFill /> },
    { name: t("about"), href: "/about", icon: <FaBuilding /> },
    {
      name: t("support-us"),
      href: "/support-us",
      icon: <BiSolidDonateHeart />,
    },
  ];

  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b justify-between px-10 py-2">
        {/* Logo and Text Links */}
        <div className="flex gap-7 items-center">
          <div className="h-10 flex">
            <Link href="/">
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

          {/* Text Links */}
          <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((link, i) => (
              <Link key={i} className="nav-link" href={link.href}>
                <span className="block text-sm font-bold">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Button Links */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
              <UserButton />
            </SignedIn>
          </div>
          <ModeToggle />
          <LanguageToggle />
          <div className="flex md:hidden">{/* <MenuToggle /> */}</div>
        </div>
      </div>
    </nav>
  );
}
