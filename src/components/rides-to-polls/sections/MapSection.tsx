'use client';

import USStateMap from '@/components/interactive/USStateMap';

export function MapSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Geographic Analysis
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Where Transportation Shapes Votes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore state-by-state laws, active programs, and the average distance voters travel to reach the polls.
          </p>
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-600"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">No restrictions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-600"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Regulations / disclosure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-600"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Restrictions on rides</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-400"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Ambiguous / no specific law</span>
          </div>
        </div>

        {/* Interactive Map */}
        <USStateMap />
      </div>
    </section>
  );
}
