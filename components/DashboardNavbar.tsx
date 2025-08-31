"use client";

import Link from "next/link";
import StyledUserButton from "@/components/StyledUserButton";
import ModeToggle from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Search from "@/components/Search";
import { FullLogo, SquareLogo } from "@/components/Logo";
import { BiBookReader } from "react-icons/bi";
import { MdNotificationsNone } from "react-icons/md";
import { TiHomeOutline } from "react-icons/ti";
import { UserButton } from "@clerk/nextjs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IoMenu } from "react-icons/io5";
import { StyledButton } from "@/components/StyledButtons";
import { usePathname } from "next/navigation";

type Page = {
  title: string;
  href: string | null;
  icon: JSX.Element;
};

const pages: Page[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <TiHomeOutline className="size-6" />,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: <BiBookReader className="size-6" />,
  },
  {
    title: "Activity",
    href: null,
    icon: <MdNotificationsNone className="size-6" />,
  },
  {
    title: "You",
    href: null,
    icon: (
      <div className="size-6 rounded-md overflow-hidden border border-default-color">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-full rounded-none",
              userButtonAvatarBox__open: "size-full rounded-none",
            },
            layout: { shimmer: false },
          }}
        />
      </div>
    ),
  },
];

export function DesktopDashboardNavbar() {
  return (
    <div className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex gap-3 border-b border-default-color justify-between px-10 py-2 items-center">
        {/* Left: Logo */}
        <div className="w-1/6 min-w-10 h-10 gap-3">
          <Link href="/dashboard" className="size-10">
            <SquareLogo />
          </Link>
        </div>

        <Search />

        {/* Right: Account Button and Toggle Buttons */}
        <div className="hidden md:flex justify-end items-center gap-3 w-1/6 min-w-[124px]">
          <StyledUserButton />
          <ModeToggle />
          <LanguageToggle />
        </div>

        {/* Mobile Drawer Menu */}
        <div className="md:hidden">
          <Drawer closeThreshold={0.5} direction="bottom">
            <DrawerTrigger asChild>
              <StyledButton size="icon">
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
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export function MobileDashboardNavbar() {
  const pathname = usePathname();

  return (
    <nav className="block md:hidden sticky bottom-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-t border-default-color justify-between px-10 py-2 items-center">
        {pages.map((page) => (
          <Link
            href={page.href || "#"}
            key={page.title}
            className={`flex flex-col items-center gap-0.5 mb-0.5 ${
              page.href === pathname
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {page.icon}
            <span className="text-2xs">{page.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
