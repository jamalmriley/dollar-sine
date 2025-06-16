"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { i18nConfig, supportedLangs } from "@/i18nConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactCountryFlag from "react-country-flag";
import { StyledDropdownIconButton } from "./StyledButtons";

export default function LanguageToggle() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StyledDropdownIconButton>
          {currentLocale === "en" && (
            <ReactCountryFlag
              className="emojiFlag"
              countryCode="US"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.25rem",
              }}
              aria-label="English (US)"
            />
          )}
          {currentLocale === "es" && (
            <ReactCountryFlag
              className="emojiFlag"
              countryCode="MX"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.25rem",
              }}
              aria-label="Spanish"
            />
          )}
          <span className="sr-only">Toggle language</span>
        </StyledDropdownIconButton>
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
