"use client";

export function DeliveryPath() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden lg:block">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="roadGradient" x1="0%" y1="100%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* 1. Main Curved Road Strip (Light Gray Band matching reference) */}
        <path
          d="M 160 520 C 380 520, 470 410, 640 330 C 740 280, 830 260, 960 260"
          stroke="url(#roadGradient)"
          strokeWidth="48"
          strokeLinecap="round"
        />

        {/* 2. Road Border lines for crisp definition */}
        <path
          d="M 160 496 C 380 496, 470 386, 640 306 C 740 256, 830 236, 960 236"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <path
          d="M 160 544 C 380 544, 470 434, 640 354 C 740 304, 830 284, 960 284"
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeOpacity="0.7"
        />

        {/* 3. Center White Dashed Line (matching reference) */}
        <path
          d="M 180 520 C 380 520, 470 410, 640 330 C 740 280, 830 260, 950 260"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeDasharray="9 9"
          strokeLinecap="round"
          className="animate-road-dash"
        />

        {/* 4. Delivery Scooter Character (Matching the cute yellow rider in reference) */}
        <g transform="translate(480, 390) scale(0.95)">
          {/* Subtle drop shadow under scooter */}
          <ellipse cx="28" cy="46" rx="28" ry="7" fill="#000000" fillOpacity="0.12" />

          {/* Rear Wheel */}
          <circle cx="8" cy="40" r="10" fill="#24242A" />
          <circle cx="8" cy="40" r="5" fill="#E2E8F0" />
          {/* Front Wheel */}
          <circle cx="48" cy="40" r="10" fill="#24242A" />
          <circle cx="48" cy="40" r="5" fill="#E2E8F0" />

          {/* Scooter Body - Brand Yellow */}
          <path
            d="M 8 40 L 22 40 L 32 30 L 48 40"
            stroke="#FFD64F"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 32 30 L 40 16"
            stroke="#24242A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Handlebar */}
          <line x1="36" y1="16" x2="44" y2="16" stroke="#24242A" strokeWidth="4" strokeLinecap="round" />

          {/* Pizza Delivery Box (Branded Orange) */}
          <rect x="-8" y="16" width="22" height="20" rx="3" fill="#E66A2C" />
          <path d="M -8 24 L 14 24" stroke="#D95716" strokeWidth="2" />
          <circle cx="3" cy="20" r="2.5" fill="#FFD64F" />

          {/* Delivery Rider */}
          <path
            d="M 18 32 C 18 22, 28 20, 32 28 Z"
            fill="#FFD64F"
          />
          {/* Helmet */}
          <circle cx="28" cy="12" r="11" fill="#FFD64F" />
          <path d="M 30 10 Q 37 12 34 16 Q 28 16 30 10 Z" fill="#24242A" />
          <circle cx="34" cy="14" r="1" fill="#FFFFFF" />

          {/* Speed steam trails */}
          <line x1="-14" y1="20" x2="-22" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <line x1="-16" y1="26" x2="-26" y2="26" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
