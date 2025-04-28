import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { NAV_HEIGHT } from "@/utils/ui";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import SignUpContextProvider from "@/contexts/sign-up-content";

const i18nNamespaces = ["layout", "sign-up"];

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
      <SignUpContextProvider>
        {/* <div className="flex flex-col h-dvh w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"> */}
        <div className="flex flex-col h-dvh w-full">
          <div className={`h-[${NAV_HEIGHT}px]`}>
            <LandingNavbar />
          </div>
          <div className="flex-1 z-20">{children}</div>
          <Footer />
        </div>
      </SignUpContextProvider>
    </TranslationsProvider>
  );
}
