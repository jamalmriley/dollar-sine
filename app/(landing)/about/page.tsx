import { Metadata } from "next";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18nConfig";

export const metadata: Metadata = setTitle("About");
const i18nNamespaces = ["about"];

export default async function AboutPage() {
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
        <h1 className="h1">{t("about-us")}</h1>
        {/* <p>About the project</p> */}
        {/* <p>About the mission</p> */}
        {/* <p>About me</p> */}
        {/* <p>videos and pictures of me and my students</p> */}
        {/* <p>bento grid of all these?</p> */}
      </div>
    </TranslationsProvider>
  );
}
