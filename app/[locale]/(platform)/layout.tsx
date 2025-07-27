import initTranslations from "@/app/i18n";
import DashboardNavbar from "@/components/DashboardNavbar";
import TranslationsProvider from "@/components/ui/translations-provider";
import LearningContextProvider from "@/contexts/learning-context";
import ContentClient from "./ContentClient";

const i18nNamespaces = ["layout", "platform-layout"];

export default async function PlatformLayout({
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
      <LearningContextProvider>
        <ContentClient>
          <DashboardNavbar />
          {children}
        </ContentClient>
      </LearningContextProvider>
    </TranslationsProvider>
  );
}
