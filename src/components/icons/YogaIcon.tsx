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
    {/* Head */}
    <circle cx="12" cy="5" r="2" />
    {/* Torso */}
    <path d="M12 7v5" />
    {/* Arms raised and slightly curved like a yoga tree pose */}
    <path d="M12 9l-3.5-2.5" />
    <path d="M12 9l3.5-2.5" />
    {/* Standing leg */}
    <path d="M12 12v7" />
    {/* Bent leg in tree pose */}
    <path d="M12 12c2 0.5 3.5 2 3.5 3.5" />
    {/* Motion / energy arc wrapping the figure */}
    <path d="M18 3.5c1.5 2 2 4 2 6.5s-1 5-2.5 6.5" />
  </svg>
);

export default YogaIcon;
