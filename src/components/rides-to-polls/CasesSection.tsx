import { caseStudies } from '@/lib/data/case-studies';

export function CasesSection() {
  return (
    <section
      id="cases"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
      aria-labelledby="cases-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Case Studies
          </p>
          <h2 id="cases-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Programs That Changed Outcomes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From church vans in Milwaukee to rideshare codes in Georgia — detailed examinations of
            transportation programs and their electoral impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <article
              key={`${caseStudy.title}-${index}`}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
              aria-labelledby={`case-title-${index}`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                    style={{ backgroundColor: caseStudy.bg }}
                    aria-hidden="true"
                  >
                    {caseStudy.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      id={`case-title-${index}`}
                      className="text-lg font-bold text-gray-900 dark:text-white"
                    >
                      {caseStudy.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {caseStudy.meta}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {caseStudy.body}
                </p>

                {/* Stats */}
                <div className="mt-6 space-y-3">
                  {caseStudy.stats.map((stat, statIndex) => (
                    <div
                      key={`${stat.label}-${statIndex}`}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stat.label}
                      </span>
                      <span
                        className="text-lg font-bold text-blue-600 dark:text-blue-400"
                        aria-label={`${stat.label}: ${stat.val}`}
                      >
                        {stat.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
