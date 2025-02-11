import { Button } from "@/components/ui/button";

type StyledButtonProps = React.ComponentProps<typeof Button>;

export default function StyledButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      className="relative inline-block px-4 py-2 group border-0"
    >
      {/* Back */}
      <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md bg-black dark:bg-emerald-400" />
      {/* Front */}
      <span
        className={`absolute inset-0 w-full h-full rounded-md border border-default-color bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950 ${props.className}`}
      />
      {/* Text */}
      <span className="relative flex justify-center items-center gap-2 group-hover:text-emerald-950">
        {props.children}
      </span>
    </Button>
  );
}
