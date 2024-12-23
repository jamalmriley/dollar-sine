"use client";

import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQueryState } from "nuqs";

const ReviewCard = ({
  img,
  displayName,
  body,
}: {
  img: string;
  displayName: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {displayName}
          </figcaption>
          <p className="text-xs text-muted-foreground">
            Sun, Dec 15 at 8:02 PM
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

// firstRow: { displayName: string; body: string; img: string }[];
// secondRow: { displayName: string; body: string; img: string }[];

export function MarqueeDemo() {
  const { user } = useUser();

  const [displayName] = useQueryState("displayName", { defaultValue: "" });
  const posts = [
    {
      displayName,
      body: "Remember, if you have any questions or need help, I'm here! Let's stay on track! ✨",
      img: user?.imageUrl || "",
    },
    {
      displayName,
      body: "Break your study time into 25-minute intervals with 5-minute breaks in between. 📖",
      img: user?.imageUrl || "",
    },
    {
      displayName,
      body: "You’re doing great! Keep pushing through. You got this! 🙌",
      img: user?.imageUrl || "",
    },
    {
      displayName,
      body: "Don’t forget your budgeting assignment is due on Friday. 📊",
      img: user?.imageUrl || "",
    },
    {
      displayName,
      body: "Take the quiz on simple vs. compound interest today! Let me know if you need help! 💡",
      img: user?.imageUrl || "",
    },
    {
      displayName,
      body: "In this week’s forum, discuss strategies for managing debt. 💳💬",
      img: user?.imageUrl || "",
    },
  ];

  const firstRow = posts.slice(0, posts.length / 2);
  // const secondRow = posts.slice(posts.length / 2);

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee> */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-primary-foreground"/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-primary-foreground"/>
    </div>
  );
}
