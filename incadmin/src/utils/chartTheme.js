export const CHART_COLORS = [
  "#045d30",
  "#3db2e1",
  "#f2b843",
  "#c22368",
  "#e17622",
  "#6366f1",
];

export function getChartTheme(isDark) {
  return {
    foreColor: isDark ? "#94a3b8" : "#64748b",
    gridColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(32,36,43,0.08)",
    tooltipTheme: isDark ? "dark" : "light",
    legendColor: isDark ? "#cbd5e1" : "#334155",
  };
}
