import { findingsData } from '@/lib/data/findings';

export function FindingsSection() {
  const getTypeStyles = (type: 'positive' | 'nuance' | 'legal') => {
    const styles = {
      positive: {
        card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-900/40'
      },
      nuance: {
        card: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
        icon: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40'
      },
      legal: {
        card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/40'
      }
    };
    return styles[type];
  };

  const getIcon = (type: 'positive' | 'nuance' | 'legal') => {
    const icons = {
      positive: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      nuance: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      legal: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    };
    return icons[type];
  };

  return (
    <section
      id="findings"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
      aria-labelledby="findings-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Research Conclusions
          </p>
          <h2 id="findings-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            What the Evidence Shows
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {findingsData.map((category, index) => {
            const styles = getTypeStyles(category.type);
            return (
              <article
                key={`${category.type}-${index}`}
                className={`rounded-lg border-2 p-6 ${styles.card}`}
                aria-labelledby={`findings-title-${index}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex-shrink-0 p-2 rounded-full ${styles.iconBg}`}>
                    <span className={styles.icon} aria-hidden="true">
                      {getIcon(category.type)}
                    </span>
                  </div>
                  <h3
                    id={`findings-title-${index}`}
                    className="text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {category.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={`${category.type}-${itemIndex}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${styles.iconBg.replace('/40', '').replace('bg-', 'bg-').replace('900/40', '600').replace('100', '500')}`}
                        aria-hidden="true"
                      ></span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Sources Footer */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Key Sources
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            U.S. Census Bureau CPS 2022 · CIRCLE/Tufts University · Rutgers/EAC Disability Report ·
            Brady & McNulty, APSR 2011 · Pereira et al., Electoral Studies 2023 · Democracy Docket ·
            Lyft Economic Impact Report 2024 · Brennan Center for Justice · Leadership Conference on
            Civil Rights · Yale ISPS GOTV Research
          </p>
        </div>
      </div>
    </section>
  );
}
