import { cn } from "../utils/cn";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <svg
        className={cn(sizes[size].icon)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" className="fill-primary-500" />
        <rect x="10" y="7" width="6" height="14" rx="1" fill="#0D0D0D" />
        <rect x="11.5" y="4" width="3" height="4" rx="0.5" fill="#0D0D0D" />
        <rect x="12" y="21" width="2" height="5" fill="#0D0D0D" />
        <polygon points="13,26 11.5,28 14.5,28" fill="#0D0D0D" />
        <line
          x1="10"
          y1="10"
          x2="12"
          y2="10"
          className="stroke-primary-500"
          strokeWidth="0.75"
        />
        <line
          x1="10"
          y1="13"
          x2="12"
          y2="13"
          className="stroke-primary-500"
          strokeWidth="0.75"
        />
        <line
          x1="10"
          y1="16"
          x2="12"
          y2="16"
          className="stroke-primary-500"
          strokeWidth="0.75"
        />
        <path
          d="M22 14 C22 14 19 18 19 20.5 C19 22.5 20.3 24 22 24 C23.7 24 25 22.5 25 20.5 C25 18 22 14 22 14 Z"
          fill="white"
        />
      </svg>
      {showText && (
        <span className={cn("font-bold text-gray-100", sizes[size].text)}>
          BioStak
        </span>
      )}
    </div>
  );
}
