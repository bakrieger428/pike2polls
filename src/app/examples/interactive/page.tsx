'use client';

import React from 'react';
import { USStateMap, ElectionSimulator } from '@/components/interactive';

/**
 * Example page demonstrating the interactive components
 * This page shows how to use USStateMap and ElectionSimulator
 */
export default function InteractiveExamplePage() {
  const handleStateClick = (stateName: string, data: any) => {
    console.log('State clicked:', stateName, data);
    // You could use this to:
    // - Show a detailed modal
    // - Update a sidebar with state info
    // - Filter other data based on state selection
    // - Navigate to a state-specific page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Interactive Components Demo
          </h1>
          <p className="mt-2 text-gray-600">
            Demonstrating USStateMap and ElectionSimulator components
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Map Section */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Voter Transportation by State
            </h2>
            <p className="text-gray-600 mb-6">
              Hover over states to see voter transportation programs and legal status.
              Click a state to trigger custom actions.
            </p>
            <div className="us-state-map-wrapper">
              <USStateMap onStateClick={handleStateClick} />
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: 'var(--color-success, #10b981)' }}
                />
                <span className="text-sm text-gray-700">No restrictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: 'var(--color-warning, #f59e0b)' }}
                />
                <span className="text-sm text-gray-700">Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: 'var(--color-error, #ef4444)' }}
                />
                <span className="text-sm text-gray-700">Restricted</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: 'var(--color-text-faint, #9ca3af)' }}
                />
                <span className="text-sm text-gray-700">Limited data</span>
              </div>
            </div>
          </div>
        </section>

        {/* Simulator Section */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Election Impact Simulator
            </h2>
            <p className="text-gray-600 mb-6">
              Adjust the parameters below to model how voter transportation programs affect
              election outcomes. Select from historical election presets or create custom scenarios.
            </p>
            <ElectionSimulator />
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Usage Examples
            </h2>

            <div className="space-y-6">
              {/* Map Example */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Using USStateMap
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { USStateMap } from '@/components/interactive';

function MyComponent() {
  const handleStateClick = (stateName: string, data: StateInfo) => {
    console.log(\`Clicked \${stateName}\`, data);
    // data includes: status, color, distance, programs, notes
  };

  return (
    <USStateMap
      className="custom-map-class"
      onStateClick={handleStateClick}
    />
  );
}`}
                </pre>
              </div>

              {/* Simulator Example */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Using ElectionSimulator
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { ElectionSimulator } from '@/components/interactive';

function MyComponent() {
  return (
    <div>
      <h2>Model Your Election</h2>
      <ElectionSimulator className="custom-simulator-class" />
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Component Features
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  USStateMap Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>D3.js geoAlbersUsa projection</li>
                  <li>TopoJSON state boundaries</li>
                  <li>Color-coded legal status</li>
                  <li>Interactive hover effects</li>
                  <li>Click handler for state selection</li>
                  <li>Responsive auto-resize</li>
                  <li>Dark mode support</li>
                  <li>Accessibility compliant</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ElectionSimulator Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>7 interactive parameter sliders</li>
                  <li>6 historical election presets</li>
                  <li>Real-time calculations</li>
                  <li>Visual bar chart</li>
                  <li>Verdict system</li>
                  <li>Responsive grid layout</li>
                  <li>Custom scenarios</li>
                  <li>Mobile-friendly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            Interactive Components for Pike2ThePolls • Built with React, D3.js, and TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}
