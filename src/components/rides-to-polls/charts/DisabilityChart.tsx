'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DisabilityChartProps {
  className?: string
}

export function DisabilityChart({ className = '' }: DisabilityChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const demColor = '#3b82f6' // blue-500
  const accentColor = '#8b5cf6' // violet-500
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textMuted = isDark ? '#9ca3af' : '#6b7280'

  // Convert hex to rgba for transparent backgrounds
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const data = {
    labels: ['2012', '2016', '2018', '2020', '2022'],
    datasets: [
      {
        label: 'No Disability',
        data: [62.5, 59, 54.0, 69, 52.4],
        borderColor: demColor,
        backgroundColor: hexToRgba(demColor, 0.2),
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        borderWidth: 2.5,
      },
      {
        label: 'With Disability',
        data: [56.8, 53, 49.3, 62, 50.8],
        borderColor: accentColor,
        backgroundColor: hexToRgba(accentColor, 0.2),
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        borderWidth: 2.5,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: textMuted,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.dataset.label}: ${ctx.parsed.y}%`
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
        min: 40,
        max: 75,
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
          text: 'Voter Turnout (%)',
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
      <Line data={data} options={options} />
    </div>
  )
}
