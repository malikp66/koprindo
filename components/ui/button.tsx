import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "rounded-full bg-primary text-primary-foreground shadow-soft hover:brightness-[1.04]",
        secondary: "rounded-full bg-secondary text-secondary-foreground hover:bg-accent",
        outline: "rounded-full border border-border/70 bg-card text-foreground shadow-soft hover:bg-accent/70",
        ghost: "rounded-full text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        destructive: "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-11 px-6 text-[0.9375rem]",
        icon: "h-10 w-10 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
