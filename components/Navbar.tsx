"use client";

import { GoHomeFill } from "react-icons/go";
import { FaBuilding } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  const navLinks = [
    { name: "Home", href: "/", icon: <GoHomeFill /> },
    { name: "About", href: "/about", icon: <FaBuilding /> },
    { name: "Support", href: "/support", icon: <BiSolidDonateHeart /> },
  ];

  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b border-black/10 dark:border-white/10 justify-between px-10 py-2">
        {/* Logo and Text Links */}
        <div className="flex gap-7 items-center">
          {/* Logo */}
          <Link href="/">
            <div className="block dark:hidden" />
            <div className="hidden dark:block" />

            {/* <Image
              className="block dark:hidden"
              src={FullLogoLight}
              alt="Journi Logo"
              height={31}
              quality={100}
            /> */}
            {/* <Image
              className="hidden dark:block"
              src={FullLogoDark}
              alt="Journi Logo"
              height={31}
              quality={100}
            /> */}
          </Link>

          {/* Text Links */}
          <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((link, i) => (
              <Link key={i} className="nav-link" href={link.href}>
                <span className="block">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Button Links */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="default">
              Teacher Login
            </Button>
            <Button variant="outline" size="default">
              Student Login
            </Button>
          </div>
          <ModeToggle />
          {/* <LanguageToggle /> */}
          <div className="flex md:hidden">{/* <MenuToggle /> */}</div>
        </div>
      </div>
    </nav>
  );
}
