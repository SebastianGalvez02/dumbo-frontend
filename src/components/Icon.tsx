import type { ReactNode } from "react";

export type IconName =
  | "arrow" | "box" | "cart" | "chart" | "chevron" | "close" | "edit" | "grid"
  | "lock" | "logout" | "mail" | "plus" | "search" | "shield" | "users";

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="m9 18 6-6-6-6M4 12h11" />,
  box: (
    <>
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="m4 7v10l8 4 8-4V7M12 11v10" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6H17a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      <path d="m3 7 6-4 6 5 6-5" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  logout: <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  edit: (
    <>
      <path d="m14 5 5 5L9 20H4v-5L14 5Z" />
      <path d="m12 7 5 5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </>
  )
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
