interface CalorieRingProps {
  goal: number;
  eaten: number;
  burned: number;
  remaining: number;
  size?: number;
}

const SEGMENTS = [
  { key: "eaten", label: "Eaten", color: "#FF6B4A" },
  { key: "burned", label: "Burned", color: "#2F9BFF" },
  { key: "remaining", label: "Remaining", color: "#FFFFFF" },
] as const;

export default function CalorieRing({
  goal,
  eaten,
  burned,
  remaining,
  size = 248,
}: CalorieRingProps) {
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const ringTotal = Math.max(goal, eaten, 1);
  const eatenLen = Math.min((eaten / ringTotal) * circumference, circumference);
  const burnedLen = Math.min((burned / ringTotal) * circumference, circumference - eatenLen);
  const remainingLen = Math.max(circumference - eatenLen - burnedLen, 0);

  const segments = [
    { ...SEGMENTS[0], length: eatenLen, offset: 0 },
    { ...SEGMENTS[1], length: burnedLen, offset: eatenLen },
    { ...SEGMENTS[2], length: remainingLen, offset: eatenLen + burnedLen },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={stroke}
          />
          {segments.map((segment) =>
            segment.length > 0 ? (
              <circle
                key={segment.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                strokeDashoffset={-segment.offset}
              />
            ) : null,
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            Remaining
          </span>
          <span className="text-5xl font-bold leading-none tabular-nums sm:text-6xl">
            {Math.round(remaining).toLocaleString("en-US")}
          </span>
          <span className="mt-1 text-sm font-medium text-white/90">kcal</span>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {SEGMENTS.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2 text-sm font-medium text-white">
            <span
              className="h-3 w-3 rounded-full shadow-sm"
              style={{ backgroundColor: segment.color }}
            />
            <span>{segment.label}</span>
            <span className="tabular-nums text-white/90">
              {segment.key === "eaten" && Math.round(eaten).toLocaleString("en-US")}
              {segment.key === "burned" && Math.round(burned).toLocaleString("en-US")}
              {segment.key === "remaining" && Math.round(remaining).toLocaleString("en-US")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
