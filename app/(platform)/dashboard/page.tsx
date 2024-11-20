import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { setTitle } from "@/lib/helpers";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import Greeting from "./components/Greeting";

export const metadata: Metadata = setTitle("Dashboard");

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <Greeting name={firstName} />
        {/* <Greeting name={"firstName"} /> */}
        <div className="flex gap-3">
          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href="/courses/enrolled">My Courses</Link>
          </Button>

          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href="/courses">All Courses</Link>
          </Button>
        </div>
      </div>

      {/* Continue learning */}
      <div className="mt-5">
        <h2 className="h2">Continue learning</h2>

        {/* Course Tile */}
        <div className="tile-parent">
          <div className="h-6 border-b flex gap-1.5 items-center pl-2">
            <div className="tile-child-1" />
            <div className="tile-child-2" />
            <div className="tile-child-3" />
          </div>
          <Skeleton className="h-full rounded-none" />
        </div>
      </div>
    </div>
  );
}
