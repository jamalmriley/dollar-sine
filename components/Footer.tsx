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

export default async function Footer({ params }: { params: any }) {
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
    <div className="flex gap-3 w-full px-10 py-5 border-t bg-antique-brass-200 dark:bg-woodsmoke-950 text-antique-brass-950 dark:text-antique-brass-100 flex-col-reverse md:flex-row items-center md:justify-between">
      {/* Credit */}
      <span className="flex gap-1.5 items-center text-sm font-bold select-none">
        {t("footer_created-with")} <FaHeart className="footer-icon" /> {`${t("footer_and")} `}
        <FaCode className="footer-icon" />.
      </span>

      {/* Social Media Icons */}
      <div className="flex gap-2">
        {socialAccounts.map((platform) => (
          <Link key={platform.name} href={platform.link} target="_blank">
            <Button
              variant="ghost"
              size="icon"
              className="text-antique-brass-950 dark:text-antique-brass-100"
            >
              {platform.icon}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
