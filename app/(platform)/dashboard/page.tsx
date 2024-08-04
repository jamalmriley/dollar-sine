import { auth } from "@/auth";
import Greeting from "./Greeting";
import { Button } from "@/components/ui/button";
import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = setTitle("Dashboard");

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="page-container">
      {/* {JSON.stringify(session)} */}
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <Greeting name={session?.user?.name?.split(" ")[0]} />
        <div className="flex gap-3">
          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href="/courses/enrolled">My Courses</Link>
          </Button>

          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href="/courses">All Courses</Link>
          </Button>
        </div>
      </div>

      <h2>Continue learning</h2>
    </div>
  );
}
