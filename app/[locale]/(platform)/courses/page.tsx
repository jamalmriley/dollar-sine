import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { promises as fs } from "fs";
import { FaPlay } from "react-icons/fa";
import placeholder from "@/assets/images/placeholders/cc_placeholder.jpg";
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
import CourseTile from "@/components/CourseTile";
import { Suspense } from "react";
import Loading from "@/app/[locale]/loading";
import TranslationsProvider from "@/components/ui/translations-provider";
import initTranslations from "@/app/i18n";
import { Metadata } from "next";
import { setTitle } from "@/utils/ui";

export const metadata: Metadata = setTitle("All Courses");
const i18nNamespaces = ["platform-layout"];

export default async function AllCoursesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const file = await fs.readFile(
    process.cwd() + "/data/test-lesson-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const courses = data.courses;

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
                    {t("all-courses")}
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
          <div className="flex justify-between items-start">
            <CustomH1 text={t("all-courses")} isPaddingEnabled />

            <Button variant="outline" asChild className="rounded-lg h-10">
              <Link href={`/dashboard`}>{t("back-to-dashboard")}</Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course: any) => (
              <CourseTile key={course.id}>
                <Link href={`/courses/${course.id}`}>
                  <Image
                    // src={course.image}
                    src={placeholder}
                    alt={`${course.title} Course Image`}
                    className="object-cover"
                  />

                  {/* Course Name, Info, and Progress */}
                  <div className="absolute bottom-0 left-0 w-full">
                    {/* Course Name and Info */}
                    <div className="p-3 bg-gradient-to-t from-zinc-950">
                      <h2 className="text-lg text-white font-bold mb-1">
                        {course.title}
                      </h2>
                      <p className="text-xs text-white">{course.description}</p>
                    </div>

                    <Progress value={50} className="h-1.5 rounded-none" />
                  </div>
                </Link>
              </CourseTile>
            ))}
          </div>
        </Suspense>
      </div>
    </TranslationsProvider>
  );
}
