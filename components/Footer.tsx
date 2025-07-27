import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaHeart,
  FaCode,
} from "react-icons/fa6";
import initTranslations from "@/app/i18n";
import { cookies } from "next/headers";

export default async function Footer() {
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

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const { t } = await initTranslations(locale, ["layout"]);

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="flex gap-3 w-full px-10 py-5 bg-emerald-400 text-woodsmoke-950 flex-col-reverse border-t border-default-color md:flex-row items-center md:justify-between">
        {/* Credit */}
        <span className="flex gap-1.5 items-center text-sm font-bold select-none">
          {t("footer_created-with")}{" "}
          <span>
            <span className="sr-only">code</span>
            <FaCode className="text-lg text-woodsmoke-950 hover:animate-hover-tada" />
          </span>{" "}
          {`${t("footer_and")} `}
          <span>
            <span className="sr-only">love</span>
            <FaHeart className="text-lg text-woodsmoke-950 hover:animate-hover-tada" />
          </span>
        </span>

        {/* Social Media Icons */}
        <div className="flex gap-2">
          {socialAccounts.map((platform) => (
            <Link key={platform.name} href={platform.link} target="_blank">
              <Button
                variant="ghost"
                size="icon"
                className="text-woodsmoke-950"
              >
                {platform.icon}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
