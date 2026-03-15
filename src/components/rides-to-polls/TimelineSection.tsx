'use client';

import { useState, useCallback } from 'react';
import { timelineData, type TimelineItem } from '@/lib/data/timeline-data';

export function TimelineSection() {
  const [filter, setFilter] = useState<string>('all');

  const filteredData = useCallback(() => {
    return filter === 'all' ? timelineData : timelineData.filter(d => d.era === filter);
  }, [filter])();

  const getTagColor = (tag: TimelineItem['tag']) => {
    const colors = {
      church: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      legislation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'civil-rights': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      controversy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      rideshare: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      GOTV: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      Research: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      Scale: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      Impact: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Legal: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getImpactClass = (impact: TimelineItem['impact']) => {
    return impact === 'high'
      ? 'border-l-4 border-red-500'
      : 'border-l-4 border-gray-300 dark:border-gray-600';
  };

  const eras = [
    { value: 'all', label: 'All Eras' },
    { value: 'early', label: '1850s–1950s' },
    { value: 'civil-rights', label: '1955–1970' },
    { value: 'modern', label: '1990s–2010s' },
    { value: 'rideshare', label: '2014–2026' },
  ];

  return (
    <section id="timeline" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900" aria-labelledby="timeline-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Historical Analysis
          </p>
          <h2 id="timeline-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            170+ Years of Rides to the Polls
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From political machines hauling voters in horse-drawn carriages to church vans on Sunday mornings —
            trace the evolution of voter transportation in America.
          </p>
        </div>

        {/* Era Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label="Filter by era">
          {eras.map((era) => (
            <button
              key={era.value}
              onClick={() => setFilter(era.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                filter === era.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              aria-pressed={filter === era.value}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>

          <div className="space-y-8">
            {filteredData.map((item, index) => (
              <article
                key={`${item.year}-${index}`}
                className={`relative pl-20 pr-4 py-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg ${getImpactClass(item.impact)}`}
                aria-labelledby={`timeline-title-${index}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${
                    item.impact === 'high' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  aria-hidden="true"
                ></div>

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <time className="text-sm font-mono font-bold text-gray-900 dark:text-white" dateTime={item.year}>
                    {item.year}
                  </time>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTagColor(item.tag)}`}
                    aria-label={`Category: ${item.tagLabel}`}
                  >
                    {item.tagLabel}
                  </span>
                </div>

                <h3
                  id={`timeline-title-${index}`}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
