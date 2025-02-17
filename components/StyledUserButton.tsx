import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function StyledUserButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative inline-block group border-0"
    >
      {/* Back */}
      <span className="absolute inset-0 size-9 transition duration-200 ease-out transform translate-x-1 translate-y-1 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md bg-black/75 dark:bg-emerald-400" />
      {/* Front */}
      <span className="absolute inset-0 size-9 rounded-md border border-default-color bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950 overflow-hidden">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-full rounded-none",
              userButtonAvatarBox__open: "size-full rounded-none",
            },
            layout: { shimmer: false },
          }}
        />
      </span>
    </Button>
  );
}
