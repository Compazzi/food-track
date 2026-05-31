interface MacroCardProps {
  title: string;
  consumed: number;
  target: number;
  unit?: string;
  barColor: string;
}

export default function MacroCard({
  title,
  consumed,
  target,
  unit = "g",
  barColor,
}: MacroCardProps) {
  const progress = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white px-4 py-4 shadow-lg shadow-black/10">
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      <p className="mt-2 text-lg font-bold tabular-nums text-neutral-900">
        <span>{Math.round(consumed)}</span>
        <span className="text-sm font-medium text-neutral-500">
          {" "}
          / {Math.round(target)}
          {unit}
        </span>
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
