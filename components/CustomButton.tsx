import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomButton({
  variant = "outline",
  text,
  srText = text,
  href,
  onClick,
  className,
  startIcon,
  endIcon,
}: {
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  text?: string;
  srText?: string;
  href?: string;
  onClick?: any;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}) {
  return (
    <>
      {onClick !== undefined && (
        <Button
          variant={variant}
          asChild
          className={`$rounded-md hover:cursor-pointer ${!text && "w-10"} h-10${` ${className}`}`}
          size={text ? "default" : "icon"}
          onClick={onClick}
        >
          <div className="flex items-center">
            {startIcon && (
              <span className={text ? "" : "flex justify-center items-center"}>
                {startIcon}
              </span>
            )}
            <span className="sr-only">{text ? text : srText}</span>
            {text && <span>{text}</span>}
            {endIcon && <>{endIcon}</>}
          </div>
        </Button>
      )}
      {href !== undefined && (
        <Button
          variant={variant}
          asChild
          className={`$rounded-md hover:cursor-pointer ${!text && "w-10"} h-10${` ${className}`}`}
          size={text ? "default" : "icon"}
        >
          <Link href={href} className="flex items-center">
            {startIcon && (
              <span className={text ? "" : "flex justify-center items-center"}>
                {startIcon}
              </span>
            )}
            <span className="sr-only">{text ? text : srText}</span>
            {text && <span>{text}</span>}
            {endIcon && <>{endIcon}</>}
          </Link>
        </Button>
      )}
    </>
  );
}
