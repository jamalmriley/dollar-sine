import { currentUser } from "@clerk/nextjs/server";
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
import Link from "next/link";

export default async function MyCoursesPage() {
  const user = await currentUser();
  const firstName = user?.firstName;
  const lastLetter = firstName?.charAt(firstName.length - 1);
  const endsWithS: boolean = lastLetter?.toLowerCase() === "s";

  // if (!isLoaded) {
  // Handle loading state however you like
  // return null;
  // }

  // if (isSignedIn) {
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
                  My Courses
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/courses/enrolled">
                      My Courses
                    </BreadcrumbLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BreadcrumbLink href="/courses">All Courses</BreadcrumbLink>
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
          <CustomH1
            text={`${firstName}'${endsWithS ? "" : "s"} Courses`}
            isPaddingEnabled
          />

          <Button variant="outline" asChild className="rounded-lg h-10">
            <Link href={`/dashboard`}>Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
  // }

  // return <div>Not signed in</div>;
}
