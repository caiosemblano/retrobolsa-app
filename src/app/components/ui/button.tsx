import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "shine relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold tracking-tight select-none [touch-action:manipulation] transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-2 aria-invalid:ring-destructive/60 motion-reduce:active:scale-100 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-10px_rgba(34,197,94,0.9)] hover:brightness-110 hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_12px_28px_-10px_rgba(34,197,94,1)] active:brightness-95",
        gold:
          "bg-gold text-gold-foreground shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_8px_20px_-10px_rgba(251,191,36,0.9)] hover:brightness-110 hover:shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_12px_28px_-10px_rgba(251,191,36,1)] active:brightness-95",
        info:
          "bg-info text-info-foreground shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-10px_rgba(79,157,255,0.9)] hover:brightness-110 hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_12px_28px_-10px_rgba(79,157,255,1)] active:brightness-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-10px_rgba(244,98,111,0.9)] hover:brightness-110 focus-visible:ring-destructive active:brightness-95",
        outline:
          "border border-input bg-card/60 text-foreground backdrop-blur-sm hover:border-primary/60 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:brightness-110",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 text-sm has-[>svg]:px-4",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-sm has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-7 text-base has-[>svg]:px-5",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
