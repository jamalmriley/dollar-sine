import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Greeting from "./components/Greeting";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { setTitle } from "@/utils/ui";
import { StyledButton } from "@/components/StyledButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18nConfig";

export const metadata: Metadata = setTitle("Dashboard");
const i18nNamespaces = ["dashboard", "platform-layout"];

export default async function DashboardPage() {
  const cookieStore = cookies();
  const locale =
    cookieStore.get("NEXT_LOCALE")?.value || i18nConfig.defaultLocale || "en";
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/dashboard");

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
          <Link href="/classroom">
            <StyledButton>{t("platform-layout:classroom")}</StyledButton>
          </Link>
        </div>

        <div className="mt-5">
          <h2 className="h2">My dashboard</h2>
          <h2 className="h2">{t("platform-layout:continue-learning")}</h2>
        </div>
      </div>
    </TranslationsProvider>
  );
}
