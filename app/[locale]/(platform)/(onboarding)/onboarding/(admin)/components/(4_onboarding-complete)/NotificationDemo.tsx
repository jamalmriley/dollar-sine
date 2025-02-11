"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";
import { IOS_APP_LINK } from "@/utils/app";
import { truncateString } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
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
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-3 shadow-md",
        // animation styles
        "transition-all duration-1000 ease-in-out hover:scale-[103%]",
        // light styles
        "backdrop-blur-md bg-white/30",
        // dark styles
        "dark:bg-black/30 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <Link
        href={IOS_APP_LINK}
        target="_blank"
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
      </Link>
    </figure>
  );
};

export function NotificationDemo({ className }: { className?: string }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const name = displayName !== "" ? displayName : (user?.fullName as string);

  let notifications = [
    {
      name: "Download our app! 📱",
      description: `Click this notification or scan the QR code.`,
      time: "Just now",
      img: user?.imageUrl || "",
    },
    {
      name: "Download our app yet?",
      description: `Click me or scan the QR code. You know you want to... 👀`,
      time: "Just now",
      img: user?.imageUrl || "",
    },
    {
      name: "Roses are red... 🌹",
      description: `Violets are blue. Download the app. I know it doesn't rhyme.`,
      time: "Just now",
      img: user?.imageUrl || "",
    },
  ];

  notifications = Array.from({ length: 6 }, () => notifications).flat();

  if (!user || !isLoaded || !isSignedIn) return null;
  return (
    <div
      className={cn(
        "relative flex h-[120px] w-full flex-col px-3 pt-10 overflow-hidden",
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
