import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { Header } from "./(home)/Header";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18nConfig";

const i18nNamespaces = ["home"];

export default async function HomePage() {
  const cookieStore = cookies();
  const locale =
    cookieStore.get("NEXT_LOCALE")?.value || i18nConfig.defaultLocale || "en";
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="w-full h-full flex flex-col">
        <Header />
      </main>
    </TranslationsProvider>
  );
}
