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
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import LinkButton from "./LinkButton";
import { Button } from "./ui/button";
import { IoMenu } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MdDashboard } from "react-icons/md";
import { Separator } from "./ui/separator";
import { loraItalic } from "@/app/fonts";
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const navLinks = [
    { label: t("home"), href: "/", icon: <GoHomeFill className="w-5 h-5" /> },
    {
      label: t("about"),
      href: "/about",
      icon: <FaBuilding className="w-5 h-5" />,
    },
    {
      label: t("support-us"),
      href: "/support-us",
      icon: <BiSolidDonateHeart className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b justify-between px-10 py-2">
        {/* Logo and Text Links */}
        <div className="flex gap-7 items-center">
          {/* Logo */}
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

          {/* Desktop Links */}
          <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((link, i) => (
              <Link key={i} className="nav-link" href={link.href}>
                <span className={`hidden md:block text-sm font-bold ${
                        pathname === link.href ||
                        (pathname ===
                          `/es${
                            link.href.endsWith("/")
                              ? link.href.slice(0, -1)
                              : link.href
                          }` &&
                          "text-emerald-400")
                      }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Button Links */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="hidden md:block">
              <LinkButton text={t("my-dashboard")} href="/dashboard" />
            </div>
            <UserButton />
          </SignedIn>
          <div className="hidden md:flex gap-3">
            <ModeToggle />
            <LanguageToggle />
          </div>
          {/* Mobile Drawer Menu */}
          <div className="md:hidden">
            <Drawer closeThreshold={0.5}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <IoMenu className="w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-5 flex flex-col gap-4">
                <DrawerHeader className="flex justify-between items-center p-0 mb-5">
                  <h1 className="h1">
                    dollar
                    <span className={`${loraItalic.className}`}> sine</span>
                  </h1>
                  <div className="flex gap-3">
                    <ModeToggle />
                    <LanguageToggle />
                  </div>
                </DrawerHeader>
                {navLinks.map((link, i) => (
                  <Link key={i} className="nav-link" href={link.href}>
                    <span
                      className={`${
                        pathname === link.href ||
                        (pathname ===
                          `/es${
                            link.href.endsWith("/")
                              ? link.href.slice(0, -1)
                              : link.href
                          }` &&
                          "text-emerald-400")
                      } flex items-center gap-3 text-sm font-bold`}
                    >
                      {link.icon}
                      {link.label}
                    </span>
                  </Link>
                ))}
                <Separator />
                <Link className="nav-link" href="/dashboard">
                  <span className="flex items-center gap-3 text-sm font-bold">
                    <MdDashboard className="w-5 h-5" />
                    {t("my-dashboard")}
                  </span>
                </Link>
                {/* <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter> */}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}
