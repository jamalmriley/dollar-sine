import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { GetResponse, UserData } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  ProfileCard,
  ProfileCardError,
  ProfileCardSkeleton,
} from "./ProfileCard";

export default function ProfileAlreadyCreated() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { isLoading, setIsLoading, lastUpdated } = useOnboardingContext();
  const [userData, setUserData] = useState<UserData>();
  const [toggle, setToggle] = useState(false);

  const getUser = async (): Promise<any> => {
    const fetchedUser = await fetch(`/api/users/get?userId=${user?.id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json: GetResponse) => {
        // console.log(json)
        return json.data;
      });
    // .catch((err) => {
    //   console.error(err);
    //   return err;
    // });

    return fetchedUser;
  };

  useEffect(() => {
    const fetchAndSetUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchAndSetUser();
  }, [lastUpdated]);

  if (!isSignedIn || !isLoaded) return;
  return (
    <div className="flex flex-col border border-default-color rounded-lg overflow-hidden">
      {/* 
      If the user has loaded and there is data, display the ProfileCard component.
      If the user has loaded and there is no data, display the ProfileCardError component.
      If the user has not loaded yet, display the ProfileCardSkeleton component.
      */}
      {!isLoading ? (
        userData ? (
          <ProfileCard toggle={toggle} userData={userData} />
        ) : (
          <ProfileCardError toggle={toggle} />
        )
      ) : (
        <ProfileCardSkeleton toggle={toggle} />
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
  );
}
