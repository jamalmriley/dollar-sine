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
import Loading from "@/app/loading";

export default async function AllCoursesPage() {
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
        <div className="flex justify-between items-start">
          <CustomH1 text="All Courses" isPaddingEnabled />

          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href={`/dashboard`}>Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course: any) => (
            <CourseTile key={course.id}>
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

              {/* Start Button */}
              <Link href={`/courses/${course.id}`}>
                <div className="badge">
                  <FaPlay className="w-5 h-5" />
                </div>
              </Link>
            </CourseTile>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
