import { CourseData, Pricing } from "@/app/api/courses/route";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/general";
import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { PaymentWindow } from "./PaymentWindow";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi2";

export default function AddCourses() {
  const header = {
    title: "Browse and add courses.",
    description: "Select the courses you want to add for your organization.",
  };

  const [courses, setCourses] = useState<CourseData[]>([]);
  const getCourses = async (): Promise<any> => {
    const courses = await fetch("/api/courses", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        return json;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });

    return courses;
  };

  useEffect(() => {
    const fetchAndSetCourses = async () => {
      try {
        const courses = await getCourses();
        const data: CourseData[] = courses.data;
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetCourses();
  }, []);

  return (
    <div className="w-full h-full max-w-3xl flex flex-col justify-normal md:border rounded-lg px-10 md:px-5 py-5 md:bg-primary-foreground">
      <div className="flex flex-col">
        <h2 className="h2">{header.title}</h2>
        {header.description !== "" && (
          <span className="subtitle">{header.description}</span>
        )}
      </div>

      <div className="flex justify-center gap-5 mb-5">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            pricing={course.pricing}
            imageUrl={course.imageUrl}
          />
        ))}
      </div>

      <PaymentWindow />
    </div>
  );
}

const planSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});

// const addOnSchema = z.object({
//   name: z.string(),
//   quantity: z.number(),
// });

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  plan: planSchema.optional(),
  // addOns: z.array(addOnSchema), // TODO
});

type Course = z.infer<typeof courseSchema>;

// CREATE
function addCourse(courses: Course[], id: string) {}

// READ
function findCourse(courses: Course[], id: string): number {
  for (let i = 0; i < courses.length; i++) {
    let course = courses[i];
    if (course.id === id) return i;
  }
  return -1;
}

function findPlan(courses: Course[], planName: string): number {
  for (let i = 0; i < courses.length; i++) {
    let plan = courses[i].plan;
    if (plan && plan.name === planName) return plan.id;
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

function CourseCard({
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
  const [selectedCourses, setSelectedCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(courseSchema.parse))
  );
  const isCourseSelected: boolean = selectedCourses
    ? findCourse(selectedCourses, id) !== -1
    : false;
  return (
    <TooltipProvider>
      <div
        className={`${
          selectedCourses && findCourse(selectedCourses, id) !== -1 && ""
        } flex border rounded-lg expandable-content`}
      >
        {/* CourseTile */}
        <div
          className={`w-48 min-w-48 aspect-[9/16] rounded-lg overflow-hidden bg-scroll flex flex-col justify-between ${
            selectedCourses &&
            findCourse(selectedCourses, id) !== -1 &&
            "border-r"
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
                      setSelectedCourses([...selectedCourses, obj]);
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
                    plan: { id: i, name: plan.name, price: plan.price },
                  };
                  if (selectedCourses)
                    setSelectedCourses(
                      updateCourse(selectedCourses, id, newCourse)
                    );
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="md:w-2/3 flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <p className="text-xs md:text-sm font-bold">{`${plan.name} Package`}</p>
                      <Tooltip>
                        <TooltipTrigger className="md:hidden">
                          <HiOutlineInformationCircle className="w-5 h-5 text-dodger-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-60 p-3 text-2xs">
                          <span>{plan.description}</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
    </TooltipProvider>
  );
}
