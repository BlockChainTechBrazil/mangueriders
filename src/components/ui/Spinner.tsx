import React from "react";

const Spinner: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 48, color = "#facc15", className = "" }) => (
  <div className={`flex items-center justify-center ${className}`} style={{ minHeight: size }}>
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ display: "block" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      />
    </svg>
  </div>
);

export default Spinner;
