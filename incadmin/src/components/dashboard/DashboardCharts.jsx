import Chart from "react-apexcharts";
import { CHART_COLORS, getChartTheme } from "@/utils/chartTheme";

const STATUS_LABELS = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function AdmissionStatusPie({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const labels = Object.keys(data).map((key) => STATUS_LABELS[key] ?? key);
  const series = Object.values(data);
  const total = series.reduce((sum, n) => sum + n, 0);

  if (total === 0) {
    return (
      <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">
        No admission data yet
      </p>
    );
  }

  return (
    <Chart
      type="donut"
      height={280}
      series={series}
      options={{
        labels,
        colors: CHART_COLORS,
        chart: { background: "transparent", fontFamily: "Inter, sans-serif" },
        legend: {
          position: "bottom",
          labels: { colors: theme.legendColor },
        },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              size: "62%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  color: theme.legendColor,
                  formatter: () => String(total),
                },
              },
            },
          },
        },
        stroke: { width: 2, colors: isDark ? ["#1a2332"] : ["#ffffff"] },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}

export function ContentDistributionPie({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const entries = Object.entries(data).filter(([, value]) => value > 0);
  const labels = entries.map(([key]) => key);
  const series = entries.map(([, value]) => value);
  const total = series.reduce((sum, n) => sum + n, 0);

  if (total === 0) {
    return (
      <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">
        No content published yet
      </p>
    );
  }

  return (
    <Chart
      type="pie"
      height={280}
      series={series}
      options={{
        labels,
        colors: CHART_COLORS,
        chart: { background: "transparent", fontFamily: "Inter, sans-serif" },
        legend: {
          position: "bottom",
          labels: { colors: theme.legendColor },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Math.round(val)}%`,
          style: { fontSize: "11px", fontWeight: 600 },
        },
        stroke: { width: 2, colors: isDark ? ["#1a2332"] : ["#ffffff"] },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}

export function AdmissionsBarChart({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const max = Math.max(...data.series, 1);

  return (
    <Chart
      type="bar"
      height={280}
      series={[{ name: "Applications", data: data.series }]}
      options={{
        chart: {
          background: "transparent",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        colors: ["#045d30"],
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: "48%",
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: data.categories,
          labels: { style: { colors: theme.foreColor } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          max: max < 5 ? 5 : undefined,
          tickAmount: 4,
          labels: { style: { colors: theme.foreColor } },
        },
        grid: {
          borderColor: theme.gridColor,
          strokeDashArray: 4,
          yaxis: { lines: { show: true } },
          xaxis: { lines: { show: false } },
        },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}
