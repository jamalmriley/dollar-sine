import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { navHeight } from "@/utils/ui";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";

const i18nNamespaces = ["layout"];

export default async function LandingLayout({
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
      <div className="flex flex-col h-dvh w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
        <div className={`h-[${navHeight}px]`}>
          <LandingNavbar />
        </div>
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </TranslationsProvider>
  );
}
