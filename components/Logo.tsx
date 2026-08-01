import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  size?: "sm" | "md";
  interactive?: boolean;
  className?: string;
};

const marks = {
  sm: { box: "size-6", image: 24 },
  md: { box: "size-8", image: 32 },
};

export function Logo({ size = "sm", interactive = false, className }: LogoProps) {
  const mark = marks[size];

  return (
    <span
      className={cn(
        "brut shadow-brut inline-flex items-center gap-2 bg-paper px-3 py-1.5",
        interactive && "press",
        className
      )}
    >
      <Image
        src="/glim-mark.png"
        alt=""
        width={mark.image}
        height={mark.image}
        className={cn(mark.box, "object-contain")}
        priority
      />
      <span
        className={cn(
          "font-mono font-extrabold tracking-tight",
          size === "md" ? "text-base" : "text-sm"
        )}
      >
        GLIM
      </span>
    </span>
  );
}
