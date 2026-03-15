'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface SurgeChartProps {
  className?: string
}

export function SurgeChart({ className = '' }: SurgeChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const accentColor = '#8b5cf6' // violet-500
  const primaryColor = '#3b82f6' // blue-500
  const demColor = '#3b82f6' // blue-500
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textMuted = isDark ? '#9ca3af' : '#6b7280'

  const data = {
    labels: [
      'Georgia',
      'Pennsylvania',
      'Wisconsin',
      'Arizona',
      'Michigan',
      'Nevada',
      'New Mexico',
      'Alaska',
    ],
    datasets: [
      {
        label: 'Election Day ride increase (%)',
        data: [18, 12, 12, 10, 9, 5, 5, 5],
        backgroundColor: (context: { raw: unknown }) => {
          const value = context.raw as number
          if (value >= 15) return accentColor
          if (value >= 10) return primaryColor
          return demColor
        },
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `+${ctx.parsed.x}% rides vs. average`
          },
        },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#1f2937',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textMuted,
          callback: (value) => `+${value}%`,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: textMuted,
          font: {
            size: 12,
          },
        },
      },
    },
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Bar data={data} options={options} />
    </div>
  )
}
