import React from "react";
import { cn } from "./lib/utils"; // update path as needed
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./registry/new-york-v4/ui/alert"; // update path as needed

export function Callout(props) {
  const {
    title,
    children,
    icon,
    className,
    ...rest
  } = props;

  return (
    <Alert
      className={cn(
        "bg-surface text-surface-foreground mt-6 w-auto border-none md:-mx-1",
        className
      )}
      {...rest}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  );
}
