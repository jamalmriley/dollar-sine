import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Greeting from "./components/Greeting";
import initTranslations from "@/app/i18n";
import CourseTile from "@/components/CourseTile";
import LinkButton from "@/components/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/lib/helpers";

export const metadata: Metadata = setTitle("Dashboard");
const i18nNamespaces = ["dashboard"];

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
            <LinkButton text={t("my-courses")} href="/courses/enrolled" />
            <LinkButton text={t("all-courses")} href="/courses" />
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h2">{t("continue-learning")}</h2>

          <CourseTile>
            <Skeleton className="h-full rounded-none" />
          </CourseTile>
        </div>
      </div>
    </TranslationsProvider>
  );
}
