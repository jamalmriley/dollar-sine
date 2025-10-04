"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import LanguageToggle from "./LanguageToggle";
import ModeToggle from "@/components/ModeToggle";
import { useTranslation } from "react-i18next";
import { IoMenu } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MdDashboard, MdLogin } from "react-icons/md";
import { Separator } from "./ui/separator";
import { FullLogo } from "@/components/Logo";
import StyledUserButton from "./StyledUserButton";
import { StyledButton } from "./StyledButton";

export default function LandingNavbar() {
  const { t } = useTranslation();
  /* const pathname = usePathname();
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
  ]; */

  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b border-default-color justify-between px-10 py-2">
        {/* Logo and Text Links */}
        <div className="flex gap-7 items-center">
          {/* Logo */}
          <Link href="/">
            <FullLogo />
          </Link>

          {/* Desktop Links */}
          {/* <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((link, i) => (
              <Link key={i} href={link.href}>
                <span
                  className={`hidden md:block text-sm font-bold ${
                    pathname === link.href ||
                    (pathname ===
                      `/es${
                        link.href.endsWith("/")
                          ? link.href.slice(0, -1)
                          : link.href
                      }` &&
                      "text-emerald-400")
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div> */}
        </div>

        {/* Button Links */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <StyledButton buttonType="action">Sign in</StyledButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="hidden md:block">
              <StyledButton>
                <Link href="/dashboard">{t("my-dashboard")}</Link>
              </StyledButton>
            </div>
            <StyledUserButton />
          </SignedIn>
          <div className="hidden md:flex gap-3">
            <ModeToggle />
            <LanguageToggle />
          </div>
          {/* Mobile Drawer Menu */}
          <div className="md:hidden">
            <Drawer closeThreshold={0.5} direction="bottom">
              <DrawerTrigger asChild>
                <StyledButton isIconButton={true}>
                  <IoMenu className="size-9" />
                  <span className="sr-only">Toggle menu</span>
                </StyledButton>
              </DrawerTrigger>
              <DrawerContent className="p-5 flex flex-col gap-4">
                <DrawerHeader className="flex justify-between items-center p-0 mb-5">
                  <FullLogo />
                  <div className="flex gap-3">
                    <ModeToggle />
                    <LanguageToggle />
                  </div>
                </DrawerHeader>
                {/* {navLinks.map((link, i) => (
                  <Link key={i} href={link.href}>
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
                ))} */}
                <Separator />
                <SignedOut>
                  <Link href="/sign-in">
                    <span className="flex items-center gap-3 text-sm font-bold">
                      <MdLogin className="w-5 h-5" />
                      {t("sign-in")}
                    </span>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <span className="flex items-center gap-3 text-sm font-bold">
                      <MdDashboard className="w-5 h-5" />
                      {t("my-dashboard")}
                    </span>
                  </Link>
                </SignedIn>
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
