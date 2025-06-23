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
import { StyledDropdownIconButtonNoText } from "./StyledButtons";
import { allCountryFlags, SquareFlag } from "react-square-flags";
import Image from "next/image";

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
        <StyledDropdownIconButtonNoText>
          {currentLocale === "en" && (
            <Image
              src="https://kapowaz.github.io/square-flags/flags/us.svg"
              alt="English"
              width="36"
              height="36"
              className="size-full"
            />
            // <SquareFlag flag={allCountryFlags["us"]} />
          )}
          {currentLocale === "es" && (
            <Image
              src="https://kapowaz.github.io/square-flags/flags/language/es.svg"
              alt="Spanish"
              width="36"
              height="36"
              className="size-full"
            />
            // <SquareFlag flag={allCountryFlags["es"]} className="size-full" />
          )}
          <span className="sr-only">Toggle language</span>
        </StyledDropdownIconButtonNoText>
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
