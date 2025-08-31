import initTranslations from "@/app/i18n";
import {
  DesktopDashboardNavbar,
  MobileDashboardNavbar,
} from "@/components/DashboardNavbar";
import TranslationsProvider from "@/components/ui/translations-provider";
import LearningContextProvider from "@/contexts/learning-context";
import PlatformClient from "./PlatformClient";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18nConfig";

const i18nNamespaces = ["layout", "platform-layout"];

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <LearningContextProvider>
        <PlatformClient>
          <DesktopDashboardNavbar />
          {children}
          <MobileDashboardNavbar />
        </PlatformClient>
      </LearningContextProvider>
    </TranslationsProvider>
  );
}
