"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Mon", docs: 4, maps: 2, sheets: 1 },
  { day: "Tue", docs: 7, maps: 4, sheets: 3 },
  { day: "Wed", docs: 5, maps: 6, sheets: 2 },
  { day: "Thu", docs: 9, maps: 5, sheets: 4 },
  { day: "Fri", docs: 12, maps: 8, sheets: 6 },
  { day: "Sat", docs: 3, maps: 2, sheets: 1 },
  { day: "Sun", docs: 6, maps: 4, sheets: 3 },
]

export function DashboardActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D92525" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#D92525" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6457f9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6457f9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSheets" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
        <Tooltip
          contentStyle={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-default)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey="docs" name="Documents" stroke="#D92525" fill="url(#colorDocs)" strokeWidth={2} />
        <Area type="monotone" dataKey="maps" name="Workflows" stroke="#6457f9" fill="url(#colorMaps)" strokeWidth={2} />
        <Area type="monotone" dataKey="sheets" name="Sheets" stroke="#34d399" fill="url(#colorSheets)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
