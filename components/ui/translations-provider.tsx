/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: any;
  locale: any;
  namespaces: any;
  resources: any;
}) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
