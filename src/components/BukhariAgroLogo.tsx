import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark';
  className?: string;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BukhariAgroLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  inverted = false,
  size = 'md'
}) => {
  // Color palette strictly matched from BA Logo.jpg:
  // Primary deep forest green: #0e4c2b, Emerald: #15803d, Vibrant Leaf: #22c55e, Lime highlight: #84cc16
  const primaryDark = inverted ? '#ffffff' : '#0B4728';
  const leafGreen = '#16A34A';
  const brightGreen = '#22C55E';
  const subtitleColor = inverted ? '#86EFAC' : '#15803D';

  const Mark = ({ sizePx = 48 }: { sizePx?: number }) => (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
    >
      <defs>
        {/* Rich green gradient for main letter B */}
        <linearGradient id="bGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E7A3E" />
          <stop offset="50%" stopColor="#0E572B" />
          <stop offset="100%" stopColor="#08381C" />
        </linearGradient>

        {/* Leaf sprout gradient */}
        <linearGradient id="leafGrad" x1="50" y1="20" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Furrow lines gradient */}
        <linearGradient id="furrowGrad" x1="60" y1="120" x2="140" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#0F532B" />
        </linearGradient>
      </defs>

      {/* Main Bold 'B' Body */}
      {/* Vertical backbone and top loop */}
      <path
        d="M 64 24 
           L 128 24 
           C 156 24, 172 40, 172 65 
           C 172 82, 160 94, 142 99 
           C 166 104, 178 122, 178 144 
           C 178 174, 154 188, 122 188 
           L 64 188 
           Z"
        fill="url(#bGrad)"
      />

      {/* Top loop cutout */}
      <path
        d="M 94 48 
           L 122 48 
           C 136 48, 144 55, 144 67 
           C 144 79, 136 86, 122 86 
           L 94 86 
           Z"
        fill="#ffffff"
      />

      {/* Bottom loop cutout background (white canvas where farm furrows and sprout sit) */}
      <path
        d="M 88 108 
           L 124 108 
           C 142 108, 152 118, 152 138 
           C 152 160, 138 170, 120 170 
           L 88 170 
           Z"
        fill="#ffffff"
      />

      {/* Arched Farm Furrows (Plowed Agricultural Soil Rows) inside bottom of B */}
      <path
        d="M 72 172 
           C 90 148, 118 144, 152 166 
           C 144 172, 130 176, 116 176 
           C 98 176, 84 174, 72 172 Z"
        fill="url(#furrowGrad)"
      />
      {/* Furrow soil lines */}
      <path d="M 82 172 C 96 156, 116 154, 136 168" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 96 174 C 104 162, 116 160, 128 170" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 108 175 L 114 164" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* 3-Leaf Sprout emerging from center of field inside B */}
      {/* Center upright leaf */}
      <path
        d="M 116 122 
           C 116 122, 122 135, 118 148 
           C 114 148, 110 135, 116 122 Z"
        fill="url(#leafGrad)"
      />
      {/* Left sprout leaf */}
      <path
        d="M 115 142 
           C 104 135, 98 140, 102 148 
           C 107 148, 112 146, 115 142 Z"
        fill="url(#leafGrad)"
      />
      {/* Right sprout leaf */}
      <path
        d="M 117 142 
           C 128 135, 134 140, 130 148 
           C 125 148, 120 146, 117 142 Z"
        fill="url(#leafGrad)"
      />

      {/* Signature Large Curved Leaf on upper-left spine of B (from BA Logo.jpg) */}
      <path
        d="M 94 32 
           C 40 40, 22 85, 38 126 
           C 48 150, 70 165, 88 168 
           C 54 158, 42 128, 48 100 
           C 54 70, 75 46, 94 32 Z"
        fill="url(#leafGrad)"
      />
      {/* Inner lighter green rib & leaf vein of outer leaf */}
      <path
        d="M 90 38 
           C 68 54, 52 82, 54 116 
           C 58 92, 72 68, 90 38 Z"
        fill="#86EFAC"
        opacity="0.9"
      />
      {/* Lower outer leaf cradle curve */}
      <path
        d="M 40 128 
           C 56 168, 92 180, 130 178 
           C 100 182, 68 174, 50 152 
           C 42 142, 38 132, 40 128 Z"
        fill="#0F532B"
      />
    </svg>
  );

  // Variant: Just the Logo Mark
  if (variant === 'mark') {
    const sizeMap = { sm: 36, md: 44, lg: 60, xl: 80 };
    return <Mark sizePx={sizeMap[size]} />;
  }

  // Variant: Stacked (Emblem on top, BUKHARI AGRO below, as in BA Logo.jpg)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <Mark sizePx={size === 'sm' ? 48 : size === 'lg' ? 96 : size === 'xl' ? 128 : 72} />
        <div className="mt-2 flex flex-col items-center">
          <div className="flex items-center tracking-tight">
            <span
              style={{ color: primaryDark }}
              className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]"
            >
              BUKHARI
            </span>
          </div>

          <div className="flex items-center gap-2 my-1 w-full justify-center">
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#16A34A]" />
            <span
              style={{ color: leafGreen }}
              className="text-xl sm:text-2xl font-black tracking-widest uppercase font-['Plus_Jakarta_Sans',sans-serif]"
            >
              AGRO
            </span>
            <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#16A34A]" />
          </div>

          <div
            style={{ color: subtitleColor }}
            className="text-[9px] sm:text-[11px] font-bold tracking-[0.25em] uppercase mt-0.5 whitespace-nowrap"
          >
            PESTICIDES • FERTILIZERS • CROP CARE
          </div>
        </div>
      </div>
    );
  }

  // Default Variant: Horizontal (As displayed on the website header)
  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none group min-w-0 ${className}`}>
      <div className="shrink-0">
        <Mark sizePx={size === 'sm' ? 32 : size === 'lg' ? 56 : size === 'xl' ? 68 : 42} />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5 truncate">
          <span
            style={{ color: primaryDark }}
            className="text-base sm:text-xl lg:text-2xl font-black tracking-wide uppercase font-['Plus_Jakarta_Sans',sans-serif]"
          >
            BUKHARI
          </span>
          <span
            style={{ color: leafGreen }}
            className="text-base sm:text-xl lg:text-2xl font-black tracking-wide uppercase font-['Plus_Jakarta_Sans',sans-serif]"
          >
            AGRO
          </span>
        </div>
        <div
          style={{ color: subtitleColor }}
          className="text-[7.5px] sm:text-[9px] font-bold tracking-[0.14em] sm:tracking-[0.20em] uppercase truncate opacity-90 mt-0.5"
        >
          PESTICIDES • FERTILIZERS • CROP CARE
        </div>
      </div>
    </div>
  );
};
