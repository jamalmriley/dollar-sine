import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ProfileCard,
  ProfileCardError,
  ProfileCardSkeleton,
} from "./ProfileCard";

export default function ProfileAlreadyCreated() {
  const { user, isLoaded } = useUser();
  const { isLoading, userData } = useOnboardingContext();
  const [toggle, setToggle] = useState<boolean>(false);
  const header = {
    title: "You finished setting up your profile!",
    description: "View your profile's details below.",
  };

  if (!user || !isLoaded) return;
  return (
    <div className="size-full flex justify-center">
      <Card className="h-fit max-w-lg mx-10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="h2">{header.title}</CardTitle>
          </div>
          {header.description !== "" && (
            <CardDescription className="subtitle">
              {header.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col border border-default-color rounded-lg overflow-hidden">
            {isLoading ? (
              <ProfileCardSkeleton toggle={toggle} />
            ) : userData ? (
              <ProfileCard toggle={toggle} userData={userData} />
            ) : (
              <ProfileCardError toggle={toggle} />
            )}

            <Button
              variant="ghost"
              className="bg-primary-foreground rounded-none border-t border-default-color"
              onClick={() => setToggle((prev) => !prev)}
            >
              <span className="sr-only">
                {toggle ? "Show less user details" : "Show more user details"}
              </span>
              {toggle ? <FaChevronUp /> : <FaChevronDown />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
