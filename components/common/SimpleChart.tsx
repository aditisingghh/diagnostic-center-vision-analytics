'use client';

interface SimpleChartProps {
  title: string;
  data: number[];
  labels: string[];
}

export function SimpleChart({ title, data, labels }: SimpleChartProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="flex items-end justify-around h-48 gap-2">
          {data.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all"
                  style={{
                    height: `${((value - minValue) / (maxValue - minValue)) * 100 || 20}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-around mt-4">
          {labels.map((label, idx) => (
            <span key={idx} className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
