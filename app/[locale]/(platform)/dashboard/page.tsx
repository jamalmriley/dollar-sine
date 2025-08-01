import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Greeting from "./components/Greeting";
import initTranslations from "@/app/i18n";
import CourseTile from "@/components/CourseTile";
import { Skeleton } from "@/components/ui/skeleton";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import { StyledButton } from "@/components/StyledButtons";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = setTitle("Dashboard");
const i18nNamespaces = ["dashboard", "platform-layout"];

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const user = await currentUser();
  if (!user) redirect(`/sign-in?redirect_url=/${locale}/dashboard`);

  const firstName = user.firstName;

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
          <Link href="/courses">
            <StyledButton>{t("platform-layout:courses")}</StyledButton>
          </Link>
        </div>

        <div className="mt-5">
          <h2 className="h2">{t("platform-layout:continue-learning")}</h2>

          <CourseTile>
            <Skeleton className="h-full rounded-none" />
          </CourseTile>
        </div>
      </div>
    </TranslationsProvider>
  );
}
