import initTranslations from "@/app/i18n";
import DashboardNavbar from "@/components/DashboardNavbar";
import TranslationsProvider from "@/components/ui/translations-provider";

const i18nNamespaces = ["layout", "platform-layout"];

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <DashboardNavbar />
      {children}
    </TranslationsProvider>
  );
}
