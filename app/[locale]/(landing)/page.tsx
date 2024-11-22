import initTranslations from "@/app/i18n";
import Home3DCard from "@/components/Home3DCard";
import TranslationsProvider from "@/components/ui/translations-provider";

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
      <main className="flex justify-center">
        <Home3DCard />
      </main>
    </TranslationsProvider>
  );
}
