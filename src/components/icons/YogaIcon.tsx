import type { LucideProps } from "lucide-react";

export const YogaIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Motion arc */}
    <path d="M19 6c-1.5 1.5-2.5 3.5-2.5 6s1 4.5 2.5 6" />
    {/* Head */}
    <circle cx="10" cy="5" r="2" />
    {/* Body in warrior / tree pose */}
    <path d="M10 7v4" />
    <path d="M10 11l-3 6" />
    <path d="M10 11l3 6" />
    <path d="M8 17h4" />
    {/* Standing leg with slight bend */}
    <path d="M10 11v5" />
    {/* Lifted leg bent */}
    <path d="M13 13c1.5 0 2.5-1 2.5-2.5" />
  </svg>
);

export default YogaIcon;
