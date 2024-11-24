import { currentUser } from "@clerk/nextjs/server";
import CustomH1 from "@/components/CustomH1";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import initTranslations from "@/app/i18n";
import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";
import TranslationsProvider from "@/components/ui/translations-provider";

export const metadata: Metadata = setTitle("My Courses");
const i18nNamespaces = ["platform-layout"];

export default async function MyCoursesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const user = await currentUser();
  const name = user?.firstName;
  // const lastLetter = name?.charAt(name.length - 1);
  // const endsWithS: boolean = lastLetter?.toLowerCase() === "s";

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="page-container">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {t("my-courses")}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <BreadcrumbLink href="/courses">
                        {t("all-courses")}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BreadcrumbLink href="/courses/enrolled">
                        {t("my-courses")}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title and Button */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <CustomH1
              text={t("my-courses-personalized", { name })}
              isPaddingEnabled
            />

            <Button variant="outline" asChild className="rounded-lg h-10">
              <Link href={`/dashboard`}>{t("back-to-dashboard")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </TranslationsProvider>
  );
}
