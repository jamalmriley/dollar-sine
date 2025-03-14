import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { formatCurrency } from "@/utils/general";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Course, COURSE_SCHEMA, Pricing } from "@/types/course";

// CREATE
function addCourse(courses: Course[], course: Course): Course[] {
  return [...courses, course];
}

// READ
function findCourse(courses: Course[], id: string): number {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    if (course.id === id) return i;
  }
  return -1;
}

function findPlan(courses: Course[], planName: string): number {
  for (let i = 0; i < courses.length; i++) {
    const plan = courses[i].plan;
    if (plan === planName) return i;
  }
  return -1;
}

// UPDATE
function updateCourse(
  courses: Course[],
  id: string,
  newCourse: Course
): Course[] {
  const result: Course[] = [];

  for (const course of courses) {
    if (course.id === id) result.push(newCourse);
    else result.push(course);
  }
  return result;
}

// DELETE
function removeCourse(courses: Course[], id: string): Course[] {
  const result: Course[] = [];

  for (const course of courses) {
    if (course.id !== id) result.push(course);
  }
  return result;
}

export default function CourseCard({
  id,
  title,
  description,
  pricing,
  imageUrl,
}: {
  id: string;
  title: string;
  description?: string;
  pricing: Pricing[];
  imageUrl: string;
}): JSX.Element {
  const searchParams = useSearchParams();
  const [selectedCourses, setSelectedCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(COURSE_SCHEMA.parse))
  );
  const isCourseSelected: boolean = selectedCourses
    ? findCourse(selectedCourses, id) !== -1
    : false;

  // Decodes the selectedCourses search params to help render the components correctly.
  useEffect(() => {
    const courses = searchParams.get("courses");
    if (courses) {
      const decoded = decodeURIComponent(courses);
      const json = JSON.parse(decoded);
      setSelectedCourses([json]);
    }
  }, [searchParams]);

  return (
    <div
      className={`${
        selectedCourses && findCourse(selectedCourses, id) !== -1 && ""
      } flex border border-default-color rounded-lg overflow-hidden expandable-content`}
    >
      {/* CourseTile */}
      <div
        className={`w-48 min-w-48 aspect-[9/16] rounded-none bg-scroll flex flex-col justify-between ${
          selectedCourses &&
          findCourse(selectedCourses, id) !== -1 &&
          "rounded-r-lg border-r border-default-color overflow-hidden"
        }`}
        style={{
          backgroundImage: `url(${
            imageUrl === ""
              ? "https://media.gettyimages.com/id/1472479627/video/classroom-learning-and-african-child-writing-notes-for-language-education-and-kindergarten.jpg?s=640x640&k=20&c=76xVk7jUdO531yG9MF-7E07eVNB06glfupkkBlKPwf8="
              : ""
          })`,
        }}
      >
        <div className="h-1/2 flex flex-col justify-start p-3 bg-gradient-to-b from-black/50 to-transparent">
          <h1 className="text-lg font-extrabold text-white">{title}</h1>
          <p className="text-2xs text-white">{description}</p>
        </div>

        <div className="h-1/2 flex flex-col justify-end p-3 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-white">From</p>
              <h1 className="text-lg font-extrabold text-white">
                {formatCurrency(pricing[0].price, "USD")}
              </h1>
            </div>
            <Button
              variant={!isCourseSelected ? "default" : "destructive"}
              className="h-7 rounded-full"
              onClick={() => {
                const obj = { id, title };
                if (selectedCourses) {
                  // See if the course is already added. If so, remove it. If not, add it.
                  if (!isCourseSelected) {
                    // Add the course to the array.
                    const newArr = addCourse(selectedCourses, obj);
                    setSelectedCourses(newArr);
                  } else {
                    // Remove the course from the array.
                    const newArr = removeCourse(selectedCourses, id);
                    setSelectedCourses(newArr.length > 0 ? newArr : null);
                  }
                } else {
                  // Add the selected course.
                  setSelectedCourses([obj]);
                }
              }}
            >
              <span className="text-xs">
                {!isCourseSelected ? "Add" : "Remove"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div
        className={`${
          selectedCourses && findCourse(selectedCourses, id) !== -1
            ? "w-[228px] md:w-[408px] p-5"
            : "w-0 p-0"
        } expandable-content overflow-hidden flex flex-col gap-5`}
      >
        {isCourseSelected &&
          pricing.map((plan, i) => (
            <button
              key={i}
              className={`w-full p-3 border rounded-lg hover:scale-105 transform transition ease-in-out duration-200 min-w-40 overflow-hidden ${
                findPlan(selectedCourses!, plan.name) !== -1
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-50"
                  : ""
              }`}
              onClick={() => {
                const newCourse: Course = {
                  id,
                  title,
                  plan: plan.name,
                };
                if (selectedCourses)
                  setSelectedCourses(
                    updateCourse(selectedCourses, id, newCourse)
                  );
              }}
            >
              <div className="flex justify-between items-center">
                <div className="md:w-2/3 flex flex-col text-left">
                  <p className="text-xs md:text-sm font-bold">{`${plan.name} Package`}</p>
                  <p
                    className={`text-2xs hidden md:block ${
                      findPlan(selectedCourses!, plan.name) !== -1
                        ? "text-emerald-800 dark:text-emerald-100"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>
                <span className="text-sm md:text-lg font-bold">{`$${plan.price}`}</span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <Skeleton className="w-48 min-w-48 aspect-[9/16] rounded-none flex flex-col justify-between">
        <div className="h-1/2 flex flex-col justify-start p-3">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 mb-2" />
          {/* Description */}
          <Skeleton className="h-2 w-full mb-1" />
          <Skeleton className="h-2 w-full mb-1" />
          <Skeleton className="h-2 w-1/2 mb-1" />
        </div>

        <div className="h-1/2 flex flex-col justify-end p-3">
          <div className="flex justify-between items-center">
            <div className="h-11 flex flex-col justify-between">
              {/* From */}
              <Skeleton className="h-3.5 w-8" />
              {/* Price */}
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Button */}
            <Skeleton className="h-7 w-[55.26px] rounded-full" />
          </div>
        </div>
      </Skeleton>
    </div>
  );
}
