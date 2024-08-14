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

export default async function AllCourses() {
  const file = await fs.readFile(
    process.cwd() + "/data/test-lesson-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const courses = data.courses;

  return (
    <div className="page-container">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  All Courses
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/courses">All Courses</BreadcrumbLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/courses/enrolled">
                      My Courses
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
          <CustomH1 text="All Courses" isPaddingEnabled />

          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href={`/dashboard`}>Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {courses.map((course: any) => (
          <div key={course.id} className="card flex flex-col justify-between">
            {/* Image and Content */}
            <div>
              <Image
                // src={course.image}
                src={placeholder}
                alt={`${course.title} Course Image`}
                // className="w-full h-40 object-contain p-3 border-b"
                className="w-full h-40 object-cover border-b"
              />
              <div className="m-3">
                {/* Course Name and Info */}
                <div>
                  <h2 className="text-lg font-bold mb-1">{course.title}</h2>
                  <p className="text-xs">{course.description}</p>

                  {/* Chapters, Topics, Date */}
                  <div className="text-gray-500 text-sm flex justify-between mt-3">
                    {/* Chapters and Topics */}
                    {!!course.chapters && (
                      <span
                        className={`${
                          course.chapters.length === 0 ? "hidden" : "block"
                        }`}
                      >
                        {`${course.chapters.length} chapter${
                          course.chapters.length === 1 ? "" : "s"
                        } • ${course.topicsCount} topic${
                          course.topicsCount === 1 ? "" : "s"
                        }`}
                      </span>
                    )}

                    {/* Date */}
                    {`${
                      new Date(course.publishDate) > new Date()
                        ? "Available"
                        : "Published"
                    } on ${new Date(course.publishDate).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}`}
                  </div>
                </div>
              </div>
            </div>

            <Progress
              value={Math.floor(Math.random() * 101)}
              className="h-2 rounded-none"
            />

            <Link href={`/courses/${course.id}`}>
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
