'use client';

import ElectionSimulator from '@/components/interactive/ElectionSimulator';

export function SimulatorSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Interactive Application
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Election Impact Simulator
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Model how transportation programs could change election outcomes. Adjust voter demographics, transportation access, and program investment to see the projected effect on turnout and margin of victory.
          </p>
        </div>

        {/* Election Simulator */}
        <ElectionSimulator />
      </div>
    </section>
  );
}
