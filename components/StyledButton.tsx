import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type StyledButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  buttonType?: "action" | "destructive" | "default";
  isIconButton?: boolean;
};

export const StyledButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  StyledButtonProps
>(
  (
    {
      buttonType = "default",
      isIconButton = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        size={isIconButton ? "icon" : "default"}
        className={cn(
          "flex justify-center items-center gap-2 overflow-hidden disabled:pointer-events-auto",
          buttonType === "action"
            ? "bg-emerald-400 hover:bg-emerald-200"
            : buttonType === "destructive"
              ? "bg-red-400 hover:bg-red-200"
              : "",
          isIconButton ? "rounded-md p-0" : "rounded-full px-4 py-2",
          className
        )}
      >
        {children}
      </Button>
    );
  }
);

StyledButton.displayName = "StyledButton";
