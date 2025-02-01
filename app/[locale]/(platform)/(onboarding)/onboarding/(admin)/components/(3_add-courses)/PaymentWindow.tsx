import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export function PaymentWindow() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsString)
  );

  const buyCourseTitle: string = selectedCourses
    ? `Buy ${
        selectedCourses.length === 1
          ? "course"
          : `${selectedCourses.length} courses`
      }`
    : "Buy";
  const buyCourseDesc: string =
    "Complete your purchase by entering your payment details below.";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {selectedCourses && (
            <Button
              className="w-[420px] md:w-[600px] mx-auto"
              disabled={selectedCourses.length === 0}
            >
              {buyCourseTitle}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{buyCourseTitle}</DialogTitle>
            <DialogDescription>{buyCourseDesc}</DialogDescription>
          </DialogHeader>
          <PaymentForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {selectedCourses && (
          <Button
            className="w-[420px] md:w-[600px] mx-auto"
            disabled={selectedCourses.length === 0}
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
        <PaymentForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PaymentForm({ className }: React.ComponentProps<"form">) {
  return <>payment stuff goes here</>;
}
