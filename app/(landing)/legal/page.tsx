import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { i18nConfig } from "@/i18nConfig";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = setTitle("Legal Stuff");
const i18nNamespaces = ["legal"];

export default async function LegalPage() {
  const cookieStore = cookies();
  const locale =
    cookieStore.get("NEXT_LOCALE")?.value || i18nConfig.defaultLocale || "en";
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="page-container">
        <h1 className="h1">{t("terms-and-conditions")}</h1>
        <h1 className="h1">{t("privacy-policy")}</h1>
      </div>
    </TranslationsProvider>
  );
}
