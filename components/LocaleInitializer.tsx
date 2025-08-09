"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export default function LocaleInitializer() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const cookieLocale = Cookies.get("NEXT_LOCALE");
    if (cookieLocale && cookieLocale !== i18n.language) {
      i18n.changeLanguage(cookieLocale).catch(console.error);
    }
    console.log("Locale initialized:", i18n.language);
  }, [i18n]);

  return null;
}
// This component initializes the locale based on the cookie value.
// It ensures that the i18n instance is set to the correct language
// when the component mounts, allowing for proper language handling in the app.
// It does not render anything visually, serving only to set the locale.
// It should be included in the root layout or a similar high-level component
// to ensure it runs early in the app lifecycle.
