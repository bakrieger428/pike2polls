'use client'

import { useEffect, useRef, useState } from 'react'
import { DemographicChart } from './charts/DemographicChart'
import { YouthChart } from './charts/YouthChart'
import { DisabilityChart } from './charts/DisabilityChart'
import { ReasonsChart } from './charts/ReasonsChart'
import { SurgeChart } from './charts/SurgeChart'

interface KPICardProps {
  icon: React.ReactNode
  value: string
  label: string
  sub: string
  source: string
}

function KPICard({ icon, value, label, sub, source }: KPICardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Extract the numeric value for animation
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0
  const suffix = value.replace(/[\d,]/g, '').trim()

  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {isVisible ? (
              <>
                {numericValue.toLocaleString()}
                {suffix && <span className="text-xl ml-1">{suffix}</span>}
              </>
            ) : (
              '0'
            )}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{sub}</div>
      <div className="text-xs text-gray-500 dark:text-gray-500 italic">
        Source: {source}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  description: string
  source: string
  children: React.ReactNode
  wide?: boolean
}

function ChartCard({
  title,
  description,
  source,
  children,
  wide = false,
}: ChartCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${
        wide ? 'col-span-full' : ''
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="chart-container" style={{ height: '300px' }}>
        {children}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-3">
        Source: {source}
      </p>
    </div>
  )
}

export function StatisticsSection() {
  return (
    <section id="statistics" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
            Statistical Analysis
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The Numbers Behind the Rides
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Academic research and Census data reveal the measurable impact of
            transportation barriers on voter turnout across demographics.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            }
            value="66%"
            label="Turnout with car access"
            sub="vs. 36% without — a 30-point gap"
            source="Harvard/BU Study, Michigan 2018"
          />
          <KPICard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            value="29%"
            label="Youth non-voters citing transport"
            sub="38% among young people of color"
            source="CIRCLE/Tufts University, 2016"
          />
          <KPICard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            value="20%"
            label="Turnout drop per extra mile"
            sub="1-mile increase to polling location"
            source="Multiple studies, cited by Lyft"
          />
          <KPICard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <path d="M1 10h22" />
              </svg>
            }
            value="1,688"
            label="Polling places closed (2012–18)"
            sub="In formerly VRA-covered states"
            source="Leadership Conference on Civil Rights"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Who Faces Transportation Barriers?"
            description="Rideshare usage to polls by demographic, compared to average. Lower-income and disabled voters depend most heavily on transportation assistance."
            source="Lyft 2024 Economic Impact Report"
          >
            <DemographicChart />
          </ChartCard>
          <ChartCard
            title="Youth Voter Turnout in Midterms"
            description="Youth turnout more than doubled from 2014 to 2018 — the same cycle rideshare companies launched election day programs."
            source="CIRCLE/Tufts University"
          >
            <YouthChart />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <ChartCard
            wide
            title="Disability Turnout Gap Over Time"
            description="Voters with disabilities consistently turn out at lower rates, with transportation cited at 4x the rate of non-disabled voters."
            source="Rutgers University / U.S. Election Assistance Commission"
          >
            <DisabilityChart />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Reasons for Not Voting (2022)"
            description="While transportation is cited as the primary reason by only 2% of non-voters, transportation-adjacent factors affect over 40%."
            source="U.S. Census Bureau CPS 2022"
          >
            <ReasonsChart />
          </ChartCard>
          <ChartCard
            title="Rideshare Election Day Surge by State (2022)"
            description="Competitive races correlate with higher rideshare usage on Election Day. Georgia's Senate race drove the biggest spike."
            source="Lyft Internal Data, 2022"
          >
            <SurgeChart />
          </ChartCard>
        </div>
      </div>
    </section>
  )
}
