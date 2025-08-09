import { Metadata } from "next";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18nConfig";

export const metadata: Metadata = setTitle("Support Us");
const i18nNamespaces = ["support-us"];

export default async function SupportUsPage() {
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
        <h1 className="h1">{t("support-us")}</h1>
        <p>support me for free: share my project on social media</p>
        <p>support my classroom: wish list</p>
        <p>donate: buy me coffee</p>
      </div>
    </TranslationsProvider>
  );
}
