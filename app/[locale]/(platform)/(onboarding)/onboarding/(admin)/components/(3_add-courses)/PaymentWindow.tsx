"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { convertToSubcurrency, formatCurrency } from "@/utils/general";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { courseSchema } from "./CourseCard";
import { useOnboardingContext } from "@/contexts/onboarding-context";

// Calling `loadStripe` outside of a component’s render avoids recreating the `Stripe` object on every render.
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined)
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined.");
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// Returns the price of the selected plan.
function getPlanPrice(
  courses: any,
  courseId: string,
  planName: string
): number {
  let result = 0;
  for (const course of courses) {
    const { id, pricing } = course;
    if (courseId === id) {
      for (const plan of pricing) {
        if (planName === plan.name) {
          result += plan.price;
        }
      }
    }
  }
  return result;
}

const getTotalAmount = (selectedCourses: any, courses: any): number => {
  let result = 0;
  if (!selectedCourses) return result;

  for (const course of selectedCourses) {
    const { id, plan } = course;
    if (plan) result += getPlanPrice(courses, id, plan);
  }
  return result;
}; // Returns the total amount of all selected courses.

export function PaymentWindow() {
  const { courses } = useOnboardingContext();
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(courseSchema.parse))
  );

  const isPlansSelected = (): boolean => {
    if (!selectedCourses) return false;

    for (const course of selectedCourses) {
      const plan = course.plan;
      if (!plan) return false;
    }
    return true;
  }; // Ensures that all selected courses have plans selected before purchase is allowed.

  // const [discountAmt, discountPercent] = [0, 0];
  const discountAmt = 0;
  const taxRate = 0.1;
  const taxAmt =
    taxRate * (getTotalAmount(selectedCourses, courses) - discountAmt);
  const grandTotal =
    getTotalAmount(selectedCourses, courses) - discountAmt + taxAmt;

  const buyCourseTitle: string = selectedCourses
    ? `Buy ${
        selectedCourses.length === 1
          ? "course"
          : `${selectedCourses.length} courses`
      }`
    : "Buy";
  const buyCourseDesc: string =
    "Complete your purchase by entering your payment details below.";

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isDesktop ? "right" : "bottom"}
    >
      <DrawerTrigger asChild>
        {selectedCourses && (
          <Button
            className="w-[420px] md:w-[600px] mx-auto"
            disabled={selectedCourses.length === 0 || !isPlansSelected()}
          >
            {buyCourseTitle}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{buyCourseTitle}</DrawerTitle>
          <DrawerDescription>{buyCourseDesc}</DrawerDescription>
        </DrawerHeader>
        <div className="px-5 overflow-y-auto">
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(grandTotal),
              currency: "usd",
            }}
          >
            <PaymentForm amount={grandTotal} />
          </Elements>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function PaymentForm({ amount }: { amount: number }) {
  const { courses } = useOnboardingContext();
  const stripe = useStripe();
  const elements = useElements();

  const [errorMsg, setErrorMsg] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsJson(courseSchema.parse))
  );

  const [discountAmt, discountPercent] = [0, 0];
  const taxRate = 0.1;
  const taxAmt =
    taxRate * (getTotalAmount(selectedCourses, courses) - discountAmt);
  const grandTotal =
    getTotalAmount(selectedCourses, courses) - discountAmt + taxAmt;

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMsg(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/onboarding-complete",
      },
    });

    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMsg && <div>{errorMsg}</div>}

      {selectedCourses && (
        <Accordion
          type="single"
          collapsible
          className="mt-5 px-5 border rounded-lg shadow-sm"
        >
          <AccordionItem value="purchase-details" className="border-0">
            <AccordionTrigger className="text-base font-semibold">
              Purchase Details
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 text-xs">
              {selectedCourses.map((course) => (
                <div key={course.id} className="flex justify-between">
                  <span>
                    {course.title}{" "}
                    {course.plan === "" && `- ${course.plan} Package`}
                  </span>

                  <span>
                    {course.plan === "" &&
                      formatCurrency(
                        getPlanPrice(courses, course.id, course.plan)
                      )}
                  </span>
                </div>
              ))}
              <Separator />
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(getTotalAmount(selectedCourses, courses))}
                </span>
              </div>
              {/* Discount */}
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="flex gap-2">
                  <span className="text-red-400">({discountPercent}% off)</span>
                  {formatCurrency(discountAmt)}
                </span>
              </div>
              {/* Tax */}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(taxAmt)}</span>
              </div>
              {/* Total */}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <Button className="w-full mt-5" disabled={!stripe || loading}>
        {loading && <Loader2 className="animate-spin" />}
        {!loading ? `Pay ${formatCurrency(amount, "USD")}` : "Processing..."}
      </Button>
    </form>
  );
}
