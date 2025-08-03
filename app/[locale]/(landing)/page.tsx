import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { Header } from "./(home)/Header";

const i18nNamespaces = ["home"];

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
