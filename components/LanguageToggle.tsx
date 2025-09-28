"use client";

import { useTranslation } from "react-i18next";
import { supportedLangs } from "@/i18nConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StyledButton } from "./StyledButton";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  // const router = useRouter();
  const { t, i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(
    () => Cookies.get("NEXT_LOCALE") || "en"
  );

  const handleChange = (newLocale: string) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/", expires: 30 });
    i18n.changeLanguage(newLocale);
    // router.refresh();
    window.location.reload();
  };

  useEffect(() => {
    const cookieLocale = Cookies.get("NEXT_LOCALE");
    if (cookieLocale && cookieLocale !== currentLocale) {
      setCurrentLocale(cookieLocale);
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StyledButton isIconButton={true}>
          <Image
            src={`https://kapowaz.github.io/square-flags/flags/${supportedLangs.find((lang) => lang.locale === currentLocale)?.flag}.svg`}
            alt={currentLocale}
            width="36"
            height="36"
            className="size-full"
          />
          <span className="sr-only">Toggle language</span>
        </StyledButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLangs.map((language) => (
          <DropdownMenuItem
            key={language.locale}
            onClick={() => handleChange(language.locale)}
          >
            {t(language.locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
