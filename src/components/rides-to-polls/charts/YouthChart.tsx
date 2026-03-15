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

interface YouthChartProps {
  className?: string
}

export function YouthChart({ className = '' }: YouthChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const primaryColor = '#3b82f6' // blue-500
  const accentColor = '#8b5cf6' // violet-500
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textMuted = isDark ? '#9ca3af' : '#6b7280'

  const data = {
    labels: ['2010', '2014', '2018', '2022'],
    datasets: [
      {
        label: 'Youth Midterm Turnout (%)',
        data: [20, 13, 28, 23],
        backgroundColor: [
          primaryColor,
          primaryColor,
          accentColor,
          primaryColor,
        ],
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.55,
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
            return `${ctx.parsed.y}% turnout`
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
        max: 35,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textMuted,
          callback: (value) => `${value}%`,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Youth Voter Turnout',
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
