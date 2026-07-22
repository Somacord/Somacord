import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — docs/design/design-system.md ("Buttons")
 *
 * - Primary: Community Green fill, white text, full pill radius, subtle lift on hover
 * - Secondary (on dark): transparent fill, white 1.5px border
 * - Secondary (on light): Deep Cord Blue fill or outline
 * - Always pill-shaped, never sharp-cornered
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold transition-[transform,box-shadow,background-color,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cord-blue disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-community-green text-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(94,140,97,0.35)]",
        "secondary-light":
          "border-[1.5px] border-cord-blue bg-transparent text-cord-blue hover:bg-cord-blue hover:text-white",
        "secondary-dark":
          "border-[1.5px] border-white bg-transparent text-white hover:bg-white hover:text-cord-blue",
      },
      size: {
        default: "px-6 py-3 text-sm",
        small: "px-[18px] py-2 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
