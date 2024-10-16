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

export default async function CoursePage({ params }: { params: any }) {
  const svgArr = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];
  const courseId = params.courseId;

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
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/courses">All Courses</BreadcrumbLink>
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
          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href="/courses">Back to courses</Link>
          </Button>
        </div>
        <h2 className="subtitle">{course.description}</h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {course.chapters.map((chapter: any) => (
          <div key={chapter.id} className="card flex flex-col justify-between">
            {/* Image and Content */}
            <div>
              <Image
                src={svgArr[chapter.id - 1]}
                alt={chapter.title}
                className="w-full h-40 object-contain p-3 border-b"
              />
              <div className="m-3">
                <div className="flex justify-between items-start">
                  {/* Chapter Title and Info */}
                  <div>
                    <span className="text-lg font-bold">
                      Chapter {chapter.id}: {chapter.title}
                    </span>
                    {!!chapter.lessons && (
                      <span
                        className={`text-gray-500 text-sm ${
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
              </div>
            </div>

            <Progress
              value={Math.floor(Math.random() * 101)}
              className="h-2 rounded-none"
            />

            <Link href={`/courses/${courseId}/chapter-${chapter.id}`}>
              <div className="badge">
                <FaPlay />
                <span>Start</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
