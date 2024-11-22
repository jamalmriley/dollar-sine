import initTranslations from "@/app/i18n";
import DashNavbar from "@/components/DashNavbar";
import TranslationsProvider from "@/components/ui/translations-provider";

const i18nNamespaces = ["layout"];

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <DashNavbar />
      {children}
    </TranslationsProvider>
  );
}
