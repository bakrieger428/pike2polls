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

interface DemographicChartProps {
  className?: string
}

export function DemographicChart({ className = '' }: DemographicChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Color palette - same as original
  const accentColor = '#8b5cf6' // violet-500
  const warningColor = '#f59e0b' // amber-500
  const primaryColor = '#3b82f6' // blue-500
  const demColor = '#3b82f6' // blue-500
  const gridColor = isDark ? '#374151' : '#e5e7eb' // gray-700 or gray-200
  const _textColor = isDark ? '#f3f4f6' : '#1f2937' // gray-100 or gray-800
  const textMuted = isDark ? '#9ca3af' : '#6b7280' // gray-400 or gray-500

  const data = {
    labels: ['Low-income', 'Disabled', 'Non-white', 'No vehicle', 'Average'],
    datasets: [
      {
        label: 'Likelihood of using rideshare to vote (multiplier vs. avg)',
        data: [3.0, 2.5, 2.0, 2.0, 1.0],
        backgroundColor: [
          accentColor,
          warningColor,
          primaryColor,
          demColor,
          gridColor,
        ],
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.65,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y
            return `${value}x more likely than average`
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
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textMuted,
          callback: (value) => `${value}x`,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Times more likely than average',
          color: textMuted,
          font: {
            size: 12,
          },
        },
      },
      x: {
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
