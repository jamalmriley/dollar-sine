"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";
import { truncateString } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { useQueryState } from "nuqs";

interface Item {
  name: string;
  description: string;
  img: string;
  time: string;
}

const Notification = ({ name, description, img, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-3",
        // animation styles
        "transition-all duration-1000 ease-in-out hover:scale-[103%]",
        // light styles
        "backdrop-blur-md bg-white/30 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "dark:bg-black/30 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex items-center gap-2">
        {/* Profile Picture */}
        <div className="flex size-8 min-w-8 min-h-8 items-center justify-center rounded-xl overflow-hidden">
          <img src={img} alt="" />
        </div>
        {/* Notification Content */}
        <div className="w-full flex flex-col overflow-hidden">
          <figcaption className="flex justify-between items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-xs">{name}</span>
            <span className="text-2xs text-primary/50">{time}</span>
          </figcaption>
          <p className="text-xs font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function NotificationDemo({ className }: { className?: string }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const name = displayName !== "" ? displayName : (user?.fullName as string);

  let notifications = [
    {
      name: "New classroom story",
      description: `${name} posted: Excellent work today! #slay`,
      time: "Just now",
      img: user?.imageUrl || "",
    },
    {
      name: name,
      description: truncateString(
        "Hello and thanks for reaching out! I'd be happy to help assist with that.",
        60
      ),
      time: "5m ago",
      img: user?.imageUrl || "",
    },
    {
      name: "New assignment",
      description: truncateString(
        `${name} assigned you "Example Assignment" due Tue, 12/31 at 11:59 PM.`,
        140
      ),
      time: "10m ago",
      img: user?.imageUrl || "",
    },
  ];

  notifications = Array.from({ length: 60 }, () => notifications).flat();

  if (!user || !isLoaded || !isSignedIn) return null;
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col px-3 pt-10 overflow-hidden",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
