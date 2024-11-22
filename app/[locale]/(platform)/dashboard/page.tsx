import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/lib/helpers";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import Greeting from "./components/Greeting";

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
          {/* <Greeting name={"firstName"} /> */}
          <div className="flex gap-3">
            <Button variant="outline" asChild className="rounded-lg h-10">
              <Link href="/courses/enrolled">{t("my-courses")}</Link>
            </Button>

            <Button variant="outline" asChild className="rounded-lg h-10">
              <Link href="/courses">{t("all-courses")}</Link>
            </Button>
          </div>
        </div>

        {/* Continue learning */}
        <div className="mt-5">
          <h2 className="h2">{t("continue-learning")}</h2>

          {/* Course Tile */}
          <div className="tile-parent">
            <div className="h-6 border-b flex gap-1.5 items-center pl-2">
              <div className="tile-child-1" />
              <div className="tile-child-2" />
              <div className="tile-child-3" />
            </div>
            <Skeleton className="h-full rounded-none" />
          </div>
        </div>
      </div>
    </TranslationsProvider>
  );
}
