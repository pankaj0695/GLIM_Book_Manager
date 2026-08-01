import type { SVGProps } from "react";
import { cn } from "@/lib/cn";
import type { BookStatus } from "@/types";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-[1.15em] shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h11v17l-5.5-4.6-5.5 4.6z" />
    </Icon>
  );
}

export function OpenBookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 7.2C9.7 5.4 6.9 4.6 3.5 4.8v13.4c3.4-.2 6.2.6 8.5 2.4 2.3-1.8 5.1-2.6 8.5-2.4V4.8c-3.4-.2-6.2.6-8.5 2.4z" />
      <path d="M12 7.2v13.4" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12.8 9.2 18 20 6.5" />
    </Icon>
  );
}

export function StackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="15" width="18" height="5.5" rx="1.2" />
      <rect x="4.8" y="9.4" width="14.4" height="5.5" rx="1.2" />
      <rect x="6.6" y="3.8" width="10.8" height="5.5" rx="1.2" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10.8" cy="10.8" r="6.6" />
      <path d="m15.8 15.8 4.4 4.4" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5v15M4.5 12h15" />
    </Icon>
  );
}

export const STATUS_ICONS: Record<
  BookStatus,
  (props: IconProps) => React.ReactElement
> = {
  "want-to-read": BookmarkIcon,
  reading: OpenBookIcon,
  completed: CheckIcon,
};
