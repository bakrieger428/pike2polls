// Findings data extracted from rides-to-polls source
export interface FindingCategory {
  type: 'positive' | 'nuance' | 'legal';
  title: string;
  items: string[];
}

export const findingsData: FindingCategory[] = [
  {
    type: 'positive',
    title: 'Strong Evidence For Impact',
    items: [
      '30-point turnout gap between voters with and without car access is causal, not just correlational',
      'Polling distance increases of just 1 mile reduce turnout up to 20%',
      'Youth turnout doubled in 2018 midterms, coinciding with first major rideshare election programs',
      '~780,000 Americans directly cited transportation as their reason for not voting in 2022',
      'Disabled voters cite transportation barriers at 4x the rate of non-disabled voters'
    ]
  },
  {
    type: 'nuance',
    title: 'Important Caveats',
    items: [
      'No U.S. randomized controlled trial exists isolating rides-to-polls specifically',
      'Brazil\'s most rigorous study found a null effect of free transit on turnout',
      'Transportation cannot be cleanly separated from other GOTV factors in elections like Georgia 2021',
      'Rideshare data is self-reported by companies with business incentives',
      'No peer-reviewed cost-per-additional-voter study exists for these programs'
    ]
  },
  {
    type: 'legal',
    title: 'Legal Landscape',
    items: [
      'Georgia Election Board ruled Lyft discounts violated state law (2025) — first such ruling',
      'Free rides (nonprofits) treated differently than discounted rides (corporate) under Georgia ruling',
      'Michigan banned voter transportation for 129 years (1891–2020)',
      'Texas requires disclosure for organized rides (HB 521, 2025)',
      'FEC allows nonpartisan GOTV rides under 11 C.F.R. § 114.4(d)'
    ]
  }
];
