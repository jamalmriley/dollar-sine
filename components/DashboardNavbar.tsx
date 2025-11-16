"use client";

import Link from "next/link";
import StyledUserButton from "@/components/StyledUserButton";
import ModeToggle from "@/components/ModeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { FullLogo, ResponsiveLogo } from "@/components/Logo";
import { TiHomeOutline } from "react-icons/ti";
import { UserButton } from "@clerk/nextjs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IoMenu, IoSearchSharp } from "react-icons/io5";
import { StyledButton } from "@/components/StyledButton";
import { usePathname } from "next/navigation";
import { lessonContentLinks } from "@/app/(platform)/classroom/[courseId]/[lessonId]/components/LessonContent";
import { useTranslation } from "react-i18next";
import { useLearningContext } from "@/contexts/learning-context";
import { FaChalkboardUser } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { FiPlus } from "react-icons/fi";

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
    title: "Classroom",
    href: "/classroom",
    icon: <FaChalkboardUser className="size-6" />,
  },
  {
    title: "Action",
    href: null,
    icon: (
      <FiPlus className="size-6 bg-emerald-400 text-white rounded-md border-default " />
    ),
  },
  {
    title: "Search",
    href: "/search",
    icon: <IoSearchSharp className="size-6" />,
  },
  {
    title: "You",
    href: null,
    icon: (
      <div className="size-6 rounded-md overflow-hidden border-default">
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
  const { activityId, setActivityId } = useLearningContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex gap-3 border-b border-default-color justify-between px-10 py-2 items-center">
        {/* Left: Logo and Desktop Links */}
        <div className="w-fit h-10 flex items-center gap-7">
          <Link href="/dashboard" className="w-fit h-10">
            <ResponsiveLogo />
          </Link>

          {isDesktop &&
            pages
              .filter((page) => page.href)
              .map((page, i) => {
                return (
                  <Link
                    key={i}
                    href={page.href || "#"}
                    className={`h-fit relative text-sm no-underline ${
                      page.href === pathname
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    } transform ease-out duration-500`}
                  >
                    {page.title}
                    {page.href === pathname ? (
                      <motion.div className="absolute -bottom-[1px] left-0 right-0 h-[1px]">
                        <svg
                          width="37"
                          height="8"
                          viewBox="0 0 37 8"
                          fill="none"
                        >
                          <motion.path
                            d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
                            stroke="#16DB93"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{
                              strokeDasharray: 84.20591735839844,
                              strokeDashoffset: 84.20591735839844,
                            }}
                            animate={{
                              strokeDashoffset: 0,
                            }}
                            transition={{
                              duration: 1,
                            }}
                          />
                        </svg>
                      </motion.div>
                    ) : null}
                  </Link>
                );
              })}
        </div>

        {/* Right: Account Button and Toggle Buttons */}
        <div className="hidden md:flex justify-end items-center gap-3">
          <StyledUserButton />
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

              {lessonContentLinks.map((link) => (
                <DrawerClose asChild key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setActivityId(link.label)}
                    className={`${
                      link.label === activityId
                        ? "text-primary"
                        : "text-muted-foreground dark:text-emerald-100"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm">
                      {link.icon}
                      {t("platform-layout:" + link.label)}
                    </span>
                  </Link>
                </DrawerClose>
              ))}
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
