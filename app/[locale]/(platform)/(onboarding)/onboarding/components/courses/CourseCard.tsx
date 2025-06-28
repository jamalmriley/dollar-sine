import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { formatCurrency } from "@/utils/general";
import { Skeleton } from "@/components/ui/skeleton";
import { Course, SELECTED_COURSE_SCHEMA, SelectedCourse } from "@/types/course";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import {
  StyledActionButton,
  StyledDestructiveButton,
  StyledIconButton,
} from "@/components/StyledButtons";
import { FiExternalLink, FiPlus } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";

export function CourseCard({
  course,
  canPurchaseCourses,
  isAlreadyPurchased,
  selectedPlan,
}: {
  course: Course;
  canPurchaseCourses: boolean;
  isAlreadyPurchased: boolean;
  selectedPlan: string;
}): JSX.Element {
  const { activeCourse, setActiveCourse } = useOnboardingContext();
  const [coursesToBuy, setCoursesToBuy] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(SELECTED_COURSE_SCHEMA.parse))
  );

  const [isLoading] = useState<boolean>(false);
  const isActiveCourse: boolean = activeCourse?.id === course.id;
  const isCourseInCart = (targetId: string): boolean => {
    if (!coursesToBuy) return false;
    for (const course of coursesToBuy) {
      if (course.id === targetId) return true;
    }
    return false;
  };
  const isButtonHighlighted = (planName: string): boolean => {
    return (
      (activeCourse && activeCourse.plan === planName) ||
      (coursesToBuy !== null &&
        activeCourse !== undefined &&
        activeCourse.plan === undefined &&
        getCourse(course.id) !== -1 &&
        coursesToBuy[getCourse(course.id)].plan === planName)
    );
  };
  // Disable button if there is no plan selected or if the course is in the cart and a different plan isn't selected.
  const isButtonDisabled: boolean =
    !activeCourse?.plan ||
    (coursesToBuy !== null &&
      activeCourse !== undefined &&
      getCourse(course.id) !== -1 &&
      coursesToBuy[getCourse(course.id)].plan === activeCourse.plan);

  function getCourse(targetId: string) {
    if (!coursesToBuy) return -1;
    for (let i = 0; i < coursesToBuy.length; i++) {
      const course = coursesToBuy[i];
      if (course.id === targetId) return i;
    }
    return -1;
  }

  function updateCourses(
    newCourse: SelectedCourse,
    courses: SelectedCourse[]
  ): SelectedCourse[] {
    let isCourseAdded: boolean = false;
    const result: SelectedCourse[] = [];

    // Update the course if it is an already existing course.
    for (const course of courses) {
      if (course.id === newCourse.id) {
        isCourseAdded = true;
        result.push(newCourse);
      } else result.push(course);
    }

    // Add the course if it's not an already existing course.
    if (!isCourseAdded) result.push(newCourse);
    return result;
  }

  function handleAddToCart() {
    if (activeCourse) {
      if (coursesToBuy) {
        const newCourses = updateCourses(activeCourse, coursesToBuy);
        setCoursesToBuy(newCourses);
      } else setCoursesToBuy([activeCourse]);
      setActiveCourse(undefined);
    }
  }

  return (
    <div className="flex border border-default-color bg-primary-foreground rounded-lg overflow-hidden expandable-content">
      {/* Tile */}
      <div className="w-48 min-w-48 aspect-[9/16] rounded-none relative">
        {/* Course Tile */}
        <div
          className={`size-full absolute flex flex-col justify-between bg-scroll ${
            isActiveCourse &&
            "rounded-r-lg border-r border-default-color overflow-hidden"
          }`}
          style={{
            backgroundImage: `url(${
              course.imageUrl === ""
                ? "https://media.gettyimages.com/id/1472479627/video/classroom-learning-and-african-child-writing-notes-for-language-education-and-kindergarten.jpg?s=640x640&k=20&c=76xVk7jUdO531yG9MF-7E07eVNB06glfupkkBlKPwf8="
                : ""
            })`,
          }}
        >
          <div className="h-1/2 flex flex-col justify-start p-3 bg-gradient-to-b from-black/50 to-transparent">
            <h1 className="text-lg font-extrabold text-white">
              {course.title}
            </h1>
            <p className="text-2xs text-white">{course.description}</p>
          </div>

          <div className="h-1/2 flex flex-col justify-end p-3 bg-gradient-to-t from-black/50 to-transparent">
            <div className="h-11 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">
                  {isAlreadyPurchased ? `${selectedPlan} Plan`.trim() : "From"}
                </p>
                <h1 className="text-lg font-extrabold text-white">
                  {isAlreadyPurchased
                    ? `${course.topicsCount} topic${course.topicsCount !== 1 ? "s" : ""}`
                    : formatCurrency(course.pricing[0].price, "USD")}
                </h1>
              </div>
              {isAlreadyPurchased ? (
                <Link href={`/explore#${course.id}`} target="_blank">
                  <StyledIconButton>
                    <FiExternalLink />
                  </StyledIconButton>
                </Link>
              ) : (
                <StyledIconButton
                  toggle={isActiveCourse}
                  variant={!isActiveCourse ? "default" : "destructive"}
                  onClick={() => {
                    setActiveCourse(
                      !isActiveCourse
                        ? { id: course.id, title: course.title }
                        : undefined
                    );
                  }}
                >
                  <span className="sr-only">
                    {isCourseInCart(course.id)
                      ? isActiveCourse
                        ? "Cancel updating course selection"
                        : "Update course selection"
                      : isActiveCourse
                        ? "Deselect course"
                        : "Select course"}
                  </span>

                  {isCourseInCart(course.id) ? (
                    isActiveCourse ? (
                      <FiPlus className="rotate-45" />
                    ) : (
                      <MdEdit />
                    )
                  ) : (
                    <FiPlus
                      className={`transition ease-in-out duration-200 ${isActiveCourse ? "rotate-45" : "rotate-0"}`}
                    />
                  )}
                </StyledIconButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div
        className={`${
          isActiveCourse ? "w-[228px] md:w-[408px] px-5 pt-3" : "w-0 p-0"
        } expandable-content overflow-hidden bg-primary-foreground`}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            {course.pricing.map((plan, i) => (
              <button
                key={i}
                className={`w-full p-3 border rounded-lg hover:scale-105 disabled:scale-100 transform transition ease-in-out duration-200 min-w-40 overflow-hidden ${
                  isButtonHighlighted(plan.name)
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-50"
                    : "bg-woodsmoke-50 dark:bg-woodsmoke-950"
                }`}
                onClick={() => {
                  setActiveCourse({
                    id: course.id,
                    title: course.title,
                    plan: plan.name,
                  });
                }}
                disabled={isLoading}
              >
                <div className="flex justify-between items-center">
                  <div className="md:w-2/3 flex flex-col text-left">
                    <p className="text-xs md:text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">{`${plan.name} Package`}</p>
                    <p
                      className={`text-2xs hidden md:block whitespace-nowrap overflow-hidden text-ellipsis ${
                        isButtonHighlighted(plan.name)
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

          {/* Height and margin are set to align with icon button. */}
          <div className="h-11 flex items-center gap-5 w-full mb-3">
            <StyledActionButton
              className="flex-1"
              onClick={() => {
                if (canPurchaseCourses) handleAddToCart();
              }}
              disabled={isLoading || isButtonDisabled}
            >
              {isCourseInCart(course.id) ? "Update cart" : "Add to cart"}
            </StyledActionButton>

            {isCourseInCart(course.id) && (
              <StyledDestructiveButton
                className="flex-1"
                onClick={() => {
                  if (coursesToBuy) {
                    const newCourses = coursesToBuy.filter(
                      (crs) => crs.id !== course.id
                    );
                    setCoursesToBuy(newCourses.length > 0 ? newCourses : null);
                    setActiveCourse(undefined);
                  }
                }}
              >
                Remove from cart
              </StyledDestructiveButton>
            )}
          </div>
        </div>
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
            <Skeleton className="size-9 rounded-md" />
          </div>
        </div>
      </Skeleton>
    </div>
  );
}
