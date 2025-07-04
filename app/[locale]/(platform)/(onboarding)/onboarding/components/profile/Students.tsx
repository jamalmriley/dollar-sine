import { updateUserMetadata } from "@/app/actions/onboarding";
import {
  StyledActionButton,
  StyledButton,
  StyledDestructiveButton,
} from "@/components/StyledButtons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { GuardianMetadata, StudentBasicDetails } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiStudent } from "react-icons/pi";
import { useMediaQuery } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

const MAX_STUDENTS: number = 3;

export default function Students() {
  const {
    userMetadata,
    setStudentId,
    setStudentFirst,
    setStudentLast,
    setStudentEmail,
    setStudentGradeLevel,
    setIsLoading,
    setLastUpdated,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  const titleText: string = "Edit student";
  const descText: string =
    "Update this student's basic details below. You'll be able to add more later.";

  if (!user || !isLoaded || !userMetadata) return;
  const guardianMetadata = userMetadata as GuardianMetadata;
  const { studentInvitations } = guardianMetadata;
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="hidden md:flex flex-col">
        <span
          className={`text-sm font-semibold ${
            studentInvitations ? "text-muted-foreground line-through" : ""
          }`}
        >
          Add your students.
        </span>
        <span className="text-xs font-medium text-muted-foreground mb-2">
          Add up to {MAX_STUDENTS}. You can add more details later.
        </span>
      </div>

      {/* Responsive Dialog */}
      <AddStudentResponsiveDialog />

      <span className="size-full flex flex-col gap-4 mt-4">
        {studentInvitations ? (
          studentInvitations.map((student, i) => (
            <div key={i} className="flex justify-between p-2 border rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm">
                  <span className="font-semibold">
                    {student.firstName} {student.lastName[0]}.
                  </span>{" "}
                  • {student.gradeLevel} grade
                </span>
                <span className="text-xs text-muted-foreground italic">
                  {student.emailAddress}
                </span>
              </div>

              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <BsThreeDotsVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => {
                          setStudentId(student.id);
                          setStudentFirst(student.firstName);
                          setStudentLast(student.lastName);
                          setStudentEmail(student.emailAddress);
                          setStudentGradeLevel(student.gradeLevel);
                        }}
                      >
                        Edit student
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        const metadata = userMetadata as GuardianMetadata;
                        const newStudentInvitations = studentInvitations.filter(
                          (stdnt) => stdnt.id !== student.id
                        );

                        const newMetadata: GuardianMetadata = {
                          ...metadata,
                          studentInvitations: newStudentInvitations,
                        };
                        await setIsLoading(true);
                        await updateUserMetadata(user.id, newMetadata)
                          .then(() => {
                            setLastUpdated(new Date().toString());
                          })
                          .catch((err) => {
                            console.error("Failed to update user data:", err);
                            setIsLoading(false);
                          });
                      }}
                    >
                      Delete student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                    <DialogDescription>{descText}</DialogDescription>
                  </DialogHeader>
                  <AddStudentForm />
                  <StudentButton action="Update" />
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <div className="size-full flex flex-col justify-center items-center bg-woodsmoke-50 text-muted-foreground select-none border rounded-lg">
            <PiStudent className="size-24" />
            <span className="font-semibold">No students added yet</span>
          </div>
        )}
      </span>
    </div>
  );
}

function AddStudentResponsiveDialog() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { userMetadata } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

  const buttonText: string = "Add student";
  const titleText: string = "Add student";
  const descText: string =
    "Add this student's basic details below. You'll be able to add more later.";

  if (!user || !isLoaded || !userMetadata) return;
  const guardianMetadata = userMetadata as GuardianMetadata;
  const { studentInvitations } = guardianMetadata;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <StyledButton disabled={studentInvitations?.length === MAX_STUDENTS}>
            {buttonText}
          </StyledButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{titleText}</DialogTitle>
            <DialogDescription>{descText}</DialogDescription>
          </DialogHeader>
          <AddStudentForm />
          <StudentButton action="Add" />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild>
        <StyledButton disabled={studentInvitations?.length === MAX_STUDENTS}>
          {buttonText}
        </StyledButton>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{titleText}</DrawerTitle>
          <DrawerDescription>{descText}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-1">
          <AddStudentForm />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <StyledDestructiveButton>Cancel</StyledDestructiveButton>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddStudentForm() {
  const {
    studentFirst,
    setStudentFirst,
    studentLast,
    setStudentLast,
    studentEmail,
    setStudentEmail,
    studentGradeLevel,
    setStudentGradeLevel,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();
  const middleSchool = ["6th", "7th", "8th"];
  const highSchool = ["9th", "10th", "11th", "12th"];

  if (!user || !isLoaded) return;
  return (
    <form action="" className="w-full flex flex-col gap-5">
      {/* First and Last Name */}
      <div className="form-row">
        {/* First Name */}
        <div className="form-item">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            value={studentFirst}
            onChange={(e) => setStudentFirst(e.target.value)}
            id="firstName"
            name="firstName"
            placeholder="John"
            type="text"
            autoCapitalize="on"
            autoComplete="given-name"
            required
          />
        </div>
        {/* Last Name */}
        <div className="form-item">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            value={studentLast}
            onChange={(e) => setStudentLast(e.target.value)}
            id="lastName"
            name="lastName"
            placeholder="Doe"
            type="text"
            autoCapitalize="on"
            autoComplete="family-name"
            required
          />
        </div>
      </div>
      {/* Email and Grade Level */}
      <div className="form-row">
        {/* Email */}
        <div className="form-item flex grow">
          <Label htmlFor="emailAddress">Email address</Label>
          <Input
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            id="emailAddress"
            name="emailAddress"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="off"
            autoComplete="email"
            required
          />
        </div>

        {/* Grade Level */}
        <div className="form-item">
          <Label htmlFor="emailAddress">Grade Level</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={
                  studentGradeLevel === "" ? "text-muted-foreground" : ""
                }
              >
                {studentGradeLevel || "Select"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Middle school</DropdownMenuLabel>
                <div className="w-full flex flex-wrap">
                  {middleSchool.map((grade, i) => (
                    <DropdownMenuItem
                      key={i}
                      // With a margin of 1 (i.e. m-1), there is a total of 8px of margin for each div.
                      className="w-[calc(33.333333%-8px)] justify-center font-semibold m-1 py-1 px-0 border border-default-color"
                      onClick={() => setStudentGradeLevel(grade)}
                    >
                      {grade}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>High school</DropdownMenuLabel>
                <div className="w-full flex flex-wrap">
                  {highSchool.map((grade, i) => (
                    <DropdownMenuItem
                      key={i}
                      // With a margin of 1 (i.e. m-1), there is a total of 8px of margin for each div.
                      className="w-[calc(50%-8px)] justify-center font-semibold m-1 py-1 px-0 border border-default-color"
                      onClick={() => setStudentGradeLevel(grade)}
                    >
                      {grade}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </form>
  );
}

function StudentButton({ action }: { action: "Add" | "Update" }) {
  const {
    studentId,
    setStudentId,
    studentFirst,
    setStudentFirst,
    studentLast,
    setStudentLast,
    studentEmail,
    setStudentEmail,
    studentGradeLevel,
    userMetadata,
    setStudentGradeLevel,
    setIsLoading,
    setLastUpdated,
  } = useOnboardingContext();
  const { user, isLoaded } = useUser();

  function clearForm(): void {
    setStudentId("");
    setStudentFirst("");
    setStudentLast("");
    setStudentEmail("");
    setStudentGradeLevel("");
  }
  async function updateStudentInvitations() {
    if (!user || !userMetadata) return;

    const invitation: StudentBasicDetails = {
      id: action === "Add" ? uuidv4() : studentId,
      firstName: studentFirst,
      lastName: studentLast,
      emailAddress: studentEmail,
      gradeLevel: studentGradeLevel,
    };

    const metadata = userMetadata as GuardianMetadata;
    const { studentInvitations } = metadata;
    const newMetadata: GuardianMetadata = {
      ...metadata,
      studentInvitations: studentInvitations
        ? action === "Add"
          ? [...studentInvitations, invitation]
          : [
              ...studentInvitations.filter((item) => item.id !== invitation.id),
              invitation,
            ]
        : [invitation],
    };
    await setIsLoading(true);
    await updateUserMetadata(user.id, newMetadata)
      .then(() => {
        clearForm();
        setLastUpdated(new Date().toString());
      })
      .catch((err) => {
        console.error("Failed to update user data:", err);
        setIsLoading(false);
      });
  }

  if (!user || !isLoaded) return;
  return (
    <DialogFooter className="flex grow">
      <DialogClose asChild>
        <StyledActionButton
          type="submit"
          onClick={updateStudentInvitations}
          className="w-full"
          disabled={
            studentFirst === "" ||
            studentLast === "" ||
            studentEmail === "" ||
            studentGradeLevel === ""
          }
        >
          {action} {studentFirst !== "" ? studentFirst : "student"}
        </StyledActionButton>
      </DialogClose>
    </DialogFooter>
  );
}
