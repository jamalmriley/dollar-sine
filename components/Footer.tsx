import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaCookieBite,
} from "react-icons/fa6";
import { IoAccessibility } from "react-icons/io5";

export default function Footer() {
  const footerLinks = [
    { name: "Cookie Preferences", icon: <FaCookieBite /> },
    { name: "Accessibility", icon: <IoAccessibility /> },
  ];
  const socialAccounts = [
    {
      name: "GitHub",
      icon: <FaGithub />,
      link: "https://github.com/jamalmriley/dollar-sine",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      link: "https://linkedin.com/in/jamalmriley",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "https://instagram.com/itsmr.riley",
    },
    {
      name: "TikTok",
      icon: <FaTiktok />,
      link: "https://tiktok.com/itsmr.riley",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center px-10 py-5 gap-3 sm:items-start bg-slate-700 dark:bg-gray-800 text-white">
      {/* Copyright and Social Media */}
      <div className="flex flex-col items-center gap-3 w-full sm:flex-row-reverse sm:justify-between">
        {/* Social Media Icons */}
        <div className="flex gap-2">
          {socialAccounts.map((platform) => (
            <Link key={platform.name} href={platform.link} target="_blank">
              <Button variant="ghost" size="icon">
                {platform.icon}
              </Button>
            </Link>
          ))}
        </div>

        {/* Credit */}
        <span className="text-xs font-bold">Created by Jamal Riley.</span>
      </div>

      {/* Links */}
      <div className="flex gap-4 md:gap-5">
        {footerLinks.map((link) => (
          <Link key={link.name} href={"/"} className="text-center">
            <span className="text-xs font-bold">{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
