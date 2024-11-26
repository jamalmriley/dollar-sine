import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { promises as fs } from "fs";
import Chapter1 from "@/assets/svg/undraw_toy_car_-7-umw.svg";
import Chapter2 from "@/assets/svg/undraw_interview_re_e5jn.svg";
import Chapter3 from "@/assets/svg/undraw_make_it_rain_re_w9pc.svg";
import Chapter4 from "@/assets/svg/undraw_savings_re_eq4w.svg";
import Chapter5 from "@/assets/svg/undraw_credit_card_payments_re_qboh.svg";
import Chapter6 from "@/assets/svg/undraw_moving_forward_re_rs8p.svg";
import { FaPlay } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
import Link from "next/link";
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
import { Metadata } from "next";
import { setTitle } from "@/lib/helpers";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/ui/translations-provider";
import CustomButton from "@/components/CustomButton";

export const metadata: Metadata = setTitle("Common Cents");
const i18nNamespaces = ["platform-layout", "common-cents"];

export default async function CoursePage({ params }: { params: any }) {
  const locale: string = params.locale;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const svgArr = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];
  // const courseId = (await params).courseId;
  const courseId: string = params.courseId;

  const difficultyLevels = new Map();
  difficultyLevels.set(0, "Varies");
  difficultyLevels.set(1, "Beginner");
  difficultyLevels.set(2, "Intermediate");
  difficultyLevels.set(3, "Advanced");
  difficultyLevels.set(4, "Expert");

  const file = await fs.readFile(
    process.cwd() + "/data/test-lesson-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const courses: any[] = data.courses;
  const course = courses.filter((course) => course.id === courseId)[0];

  return (
    <div className="page-container">
      <Suspense fallback={<Loading />}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  {t("dashboard")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* TODO: make it say "My Courses" if this is an enrolled course, or "All Courses" if it is not. */}
                <BreadcrumbLink href="/courses">
                  {t("all-courses")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      {course.title}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {courses.map((course: any) => (
                        <DropdownMenuItem key={course.id}>
                          <BreadcrumbLink href={`/courses/${course.id}`}>
                            {course.title}
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title, Subtitle, and Button */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <CustomH1 text={course.title} isPaddingEnabled={false} />
              <CustomButton text={t("back-to-courses")} href="/courses" />
            </div>
            <h2 className="subtitle">{course.description}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {course.chapters.map((chapter: any) => (
              <CourseTile key={chapter.id}>
                <Link href={`/courses/${courseId}/chapter-${chapter.id}`}>
                  {/* Image and Content */}
                  <Image
                    src={svgArr[chapter.id - 1]}
                    alt={chapter.title}
                    className="object-contain p-10 bg-blue-300"
                  />
                  {/* Chapter Name, Info, and Progress */}
                  <div className="absolute bottom-0 left-0 w-full">
                    {/* Chapter Name and Info */}
                    <div className="flex justify-between items-start px-3 pt-10 pb-3 bg-gradient-to-t from-zinc-950 text-white">
                      {/* Chapter Title and Info */}
                      <div>
                        <span className="text-lg font-bold">
                          Chapter {chapter.id}: {chapter.title}
                        </span>
                        {!!chapter.lessons && (
                          <span
                            className={`text-sm ${
                              chapter.lessons.length === 0 ? "hidden" : "block"
                            }`}
                          >
                            {`${chapter.lessons.length} lesson${
                              chapter.lessons.length === 1 ? "" : "s"
                            } • ${chapter.topicsCount} topic${
                              chapter.topicsCount === 1 ? "" : "s"
                            }`}
                          </span>
                        )}

                        {/* <span className="block text-sm font-bold">31% completed</span> */}
                      </div>

                      {/* Ratings */}
                      <div className="text-xs font-bold flex flex-col items-end gap-1 py-1">
                        <span className="flex gap-0.5">
                          {chapter.difficulty >= 1 ? (
                            <FaStar className="star text-yellow-200" />
                          ) : (
                            <FaRegStar className="star text-gray-500" />
                          )}
                          {chapter.difficulty >= 2 ? (
                            <FaStar className="star text-yellow-200" />
                          ) : (
                            <FaRegStar className="star text-gray-500" />
                          )}
                          {chapter.difficulty >= 3 ? (
                            <FaStar className="star text-yellow-200" />
                          ) : (
                            <FaRegStar className="star text-gray-500" />
                          )}
                          {chapter.difficulty >= 4 ? (
                            <FaStar className="star text-yellow-200" />
                          ) : (
                            <FaRegStar className="star text-gray-500" />
                          )}
                        </span>
                        {difficultyLevels.get(chapter.difficulty)}
                      </div>
                    </div>
                    <Progress value={50} className="h-1.5 rounded-none" />
                  </div>
                </Link>
              </CourseTile>
            ))}
          </div>
        </TranslationsProvider>
      </Suspense>
    </div>
  );
}
