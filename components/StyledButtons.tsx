import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type StyledButtonProps = React.ComponentProps<typeof Button>;
type StyledToggleButtonProps = StyledButtonProps & {
  toggle?: boolean;
};

const sharedIconButtonClasses: string = "relative inline-block group border-0";
const sharedButtonClasses: string =
  sharedIconButtonClasses + " px-4 py-2 disabled:pointer-events-auto";
const sharedBackClasses: string =
  "absolute inset-0 size-full transition duration-200 ease-out transform translate-x-1 translate-y-1 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md bg-black/75 dark:bg-white/75";
const sharedFrontClasses: string =
  "absolute inset-0 size-full rounded-md border border-default-color transition duration-200 ease-out";
const sharedTextClasses: string =
  "relative flex justify-center items-center gap-2";

export function StyledButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(sharedButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses} dark:bg-emerald-400`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

export function StyledActionButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(sharedButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses} dark:bg-selective-yellow-300`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-selective-yellow-300 dark:bg-primary-foreground group-hover:bg-selective-yellow-100`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

export function StyledDestructiveButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(sharedButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses} dark:bg-red-400`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-red-400 dark:bg-primary-foreground group-hover:bg-red-200`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

export function StyledIconButton({
  toggle = false,
  children,
  ...props
}: StyledToggleButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      size="icon"
      className={`${sharedIconButtonClasses}`}
    >
      {/* Back */}
      <span className={`${sharedBackClasses}`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} ${toggle ? "bg-red-400" : "bg-selective-yellow-300"} ${toggle ? "group-hover:bg-red-200" : "group-hover:bg-selective-yellow-100"}`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{children}</span>
    </Button>
  );
}

export function StyledIconActionButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      size="icon"
      className={`${sharedIconButtonClasses}`}
    >
      {/* Back */}
      <span className={`${sharedBackClasses} dark:bg-selective-yellow-300`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-selective-yellow-300 dark:bg-primary-foreground group-hover:bg-selective-yellow-100`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

export function StyledIconDestructiveButton({ ...props }: StyledButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      size="icon"
      className={`${sharedIconButtonClasses}`}
    >
      {/* Back */}
      <span className={`${sharedBackClasses}`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-red-400 group-hover:bg-red-200`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

function StyledDropdownIconButtonBase(
  props: React.ComponentPropsWithoutRef<typeof Button>,
  ref: React.Ref<React.ElementRef<typeof Button>>
) {
  return (
    <Button
      ref={ref}
      {...props}
      variant="outline"
      size="icon"
      className={cn(sharedIconButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses}`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

function StyledDropdownIconButtonNoTextBase(
  props: React.ComponentPropsWithoutRef<typeof Button>,
  ref: React.Ref<React.ElementRef<typeof Button>>
) {
  return (
    <Button
      ref={ref}
      {...props}
      variant="outline"
      size="icon"
      className={cn(sharedIconButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses}`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} overflow-hidden bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950`}
      >
        {props.children}
      </span>
    </Button>
  );
}

function StyledDropdownButtonBase(
  props: React.ComponentPropsWithoutRef<typeof Button>,
  ref: React.Ref<React.ElementRef<typeof Button>>
) {
  return (
    <Button
      ref={ref}
      {...props}
      variant="outline"
      className={cn(sharedButtonClasses, props.className)}
    >
      {/* Back */}
      <span className={`${sharedBackClasses}`} />
      {/* Front */}
      <span
        className={`${sharedFrontClasses} bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950`}
      />
      {/* Text */}
      <span className={`${sharedTextClasses}`}>{props.children}</span>
    </Button>
  );
}

export const StyledDropdownIconButton = React.forwardRef(
  StyledDropdownIconButtonBase
);
StyledDropdownIconButton.displayName = "StyledDropdownIconButton";

export const StyledDropdownIconButtonNoText = React.forwardRef(
  StyledDropdownIconButtonNoTextBase
);
StyledDropdownIconButton.displayName = "StyledDropdownIconButtonNoText";

export const StyledDropdownButton = React.forwardRef(StyledDropdownButtonBase);
StyledDropdownButton.displayName = "StyledDropdownButton";
