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

export function ProgramsDistributionBar({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const categories = data?.categories ?? [];
  const series = data?.series ?? [];

  if (!series.length || series.every((value) => value === 0)) {
    return (
      <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">
        No program distribution yet
      </p>
    );
  }

  return (
    <Chart
      type="bar"
      height={280}
      series={[{ name: "Applications", data: series }]}
      options={{
        colors: ["#3BA4D8"],
        chart: { background: "transparent", fontFamily: "Inter, sans-serif" },
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "60%",
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories,
          labels: { style: { colors: theme.foreColor } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: { style: { colors: theme.foreColor } },
          min: 0,
        },
        grid: {
          borderColor: theme.gridColor,
          strokeDashArray: 4,
        },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}

export function AdmissionsLineChart({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const max = Math.max(...(data?.series ?? [1]), 1);

  return (
    <Chart
      type="line"
      height={280}
      series={[{ name: "Applications", data: data?.series ?? [] }]}
      options={{
        chart: {
          background: "transparent",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        colors: ["#05692E"],
        stroke: {
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 4,
          strokeWidth: 0,
          hover: { size: 5 },
        },
        dataLabels: { enabled: false },        
        xaxis: {
          categories: data?.categories ?? [],
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
          xaxis: { lines: { show: true } },
        },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}

export function ContactTrendsArea({ data, isDark }) {
  const theme = getChartTheme(isDark);
  const max = Math.max(...(data?.series ?? [1]), 1);

  return (
    <Chart
      type="area"
      height={280}
      series={[{ name: "Contacts", data: data?.series ?? [] }]}
      options={{
        chart: {
          background: "transparent",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        colors: ["#F97316"],
        stroke: {
          curve: "smooth",
          width: 2.5,
        },
        markers: { size: 0 },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.05,
            stops: [0, 100],
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: data?.categories ?? [],
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
        },
        tooltip: { theme: theme.tooltipTheme },
      }}
    />
  );
}
