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
    {/* Arms raised in a V / yoga pose */}
    <path d="M12 9l-4-3" />
    <path d="M12 9l4-3" />
    {/* Standing leg */}
    <path d="M12 12v6" />
    {/* Lifted / bent leg in motion */}
    <path d="M12 12c2 1 3.5 2.5 3.5 4.5" />
    {/* Motion / energy arc */}
    <path d="M18 4c1 1.5 2 3.5 2 6s-1 4.5-2 6" />
  </svg>
);

export default YogaIcon;
