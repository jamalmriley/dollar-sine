import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import { i18nConfig } from "@/i18nConfig";
import { checkRole } from "@/utils/roles";
import { setTitle } from "@/utils/ui";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = setTitle("Admin Settings");
const i18nNamespaces = ["admin"];

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/admin");

  const cookieStore = cookies();
  const locale =
    cookieStore.get("NEXT_LOCALE")?.value || i18nConfig.defaultLocale || "en";
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const isAdmin = await checkRole(["admin", "super_admin"]);

  if (!isAdmin) redirect("/dashboard");
  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="page-container">
        <h1 className="h1">{t("admin-settings")}</h1>
        <div>organizations</div>
        <div>invite user</div>
        <div>view as user</div>
      </div>
    </TranslationsProvider>
  );
}
