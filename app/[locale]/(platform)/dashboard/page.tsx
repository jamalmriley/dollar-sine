import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Greeting from "./components/Greeting";
import initTranslations from "@/app/i18n";
import CourseTile from "@/components/CourseTile";
import CustomButton from "@/components/CustomButton";
import { Skeleton } from "@/components/ui/skeleton";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import TestSpotlightComponent from "./components/TestSpotlightComponent";

export const metadata: Metadata = setTitle("Dashboard");
const i18nNamespaces = ["dashboard", "platform-layout"];

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const user = await currentUser();
  const firstName = user?.firstName;

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <Greeting name={firstName} />
          <div className="flex gap-3">
            <CustomButton
              text={t("platform-layout:my-courses")}
              href="/courses/enrolled"
            />
            <CustomButton
              text={t("platform-layout:all-courses")}
              href="/courses"
            />
          </div>
        </div>

        <div className="mt-5">
          <TestSpotlightComponent />
          <h2 className="h2">{t("platform-layout:continue-learning")}</h2>

          <CourseTile>
            <Skeleton className="h-full rounded-none" />
          </CourseTile>
        </div>
      </div>
    </TranslationsProvider>
  );
}
