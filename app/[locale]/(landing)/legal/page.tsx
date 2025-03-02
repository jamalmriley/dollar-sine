import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("Legal Stuff");
const i18nNamespaces = ["legal"];

export default async function LegalPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
