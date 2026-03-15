'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ReasonsChartProps {
  className?: string
}

export function ReasonsChart({ className = '' }: ReasonsChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const accentColor = '#8b5cf6' // violet-500
  const surfaceColor = isDark ? '#1f2937' : '#ffffff'

  const data = {
    labels: [
      'Too busy (27%)',
      'Not interested (18%)',
      'Illness/disability (13%)',
      'Out of town (8%)',
      'Forgot (8%)',
      "Didn't like candidates (6%)",
      'Transportation (2%)',
      'Registration issues (2%)',
      'Inconvenient polling (2%)',
      'Other (14%)',
    ],
    datasets: [
      {
        data: [27, 18, 13, 8, 8, 6, 2, 2, 2, 14],
        backgroundColor: [
          '#6b7280', // gray-500
          '#9ca3af', // gray-400
          '#d1d5db', // gray-300
          '#93c5fd', // blue-300
          '#a5b4fc', // indigo-300
          '#c4b5fd', // violet-300
          accentColor, // violet-500 (accented for transportation)
          '#fbbf24', // amber-400
          '#fb923c', // orange-400
          '#e5e7eb', // gray-200
        ],
        borderWidth: 2,
        borderColor: surfaceColor,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 8,
          font: {
            size: 11,
          },
          color: isDark ? '#9ca3af' : '#6b7280',
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.label || ''}`
          },
        },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#1f2937',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Doughnut data={data} options={options} />
    </div>
  )
}
