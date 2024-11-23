import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { setTitle } from "@/lib/helpers";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import Greeting from "./components/Greeting";
import CourseTile from "@/components/CourseTile";
import LinkButton from "@/components/LinkButton";

export const metadata: Metadata = setTitle("Dashboard");

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <Greeting name={firstName} />
        <div className="flex gap-3">
          <LinkButton text="My Courses" href="/courses/enrolled" />
          <LinkButton text="All Courses" href="/courses" />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="h2">Continue learning</h2>

        <CourseTile>
          <Skeleton className="h-full rounded-none" />
        </CourseTile>
      </div>
    </div>
  );
}
