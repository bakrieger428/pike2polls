// Case studies data extracted from rides-to-polls source
export interface CaseStudy {
  icon: string;
  bg: string;
  title: string;
  meta: string;
  body: string;
  stats: Array<{ label: string; val: string }>;
}

export const caseStudies: CaseStudy[] = [
  {
    icon: '⛪',
    bg: '#f0e8d5',
    title: 'Souls to the Polls',
    meta: 'Florida → National, 1990s–present',
    body: 'Black church-led voter mobilization tradition. Church vans and buses transport congregants from Sunday services to early voting locations. Originated in Florida in the 1990s, now operates in cities across the country. Academic research found 3.5–12.4 percentage point turnout increases in targeted communities.',
    stats: [
      { label: 'Turnout Increase', val: '3.5–12.4 pp' },
      { label: 'Milwaukee 2024', val: '85% turnout' },
      { label: 'WI Congregations', val: '450+' }
    ]
  },
  {
    icon: '🍑',
    bg: '#d5f0e0',
    title: 'Georgia Runoffs 2021',
    meta: 'Georgia, January 2021',
    body: 'Unprecedented concentration of transportation programs. Rideshare2Vote, Plus1Vote (geofenced Uber rides in all 159 counties), Fair Fight, and New Georgia Project all operated simultaneously. Ossoff and Warnock wins flipped the US Senate.',
    stats: [
      { label: 'Ossoff Margin', val: '~55,000 votes' },
      { label: 'Black Electorate', val: '32%' },
      { label: 'Turnout Drop vs. General', val: 'Only 10%' }
    ]
  },
  {
    icon: '🚗',
    bg: '#d5e8f0',
    title: 'Uber/Lyft Election Programs',
    meta: 'National, 2014–present',
    body: 'Lyft has helped 3M+ people ride to the polls since 2014. Both companies offered 50% discounts in 2024. Research shows a 30-point turnout gap between car-owning and non-car-owning voters, and rideshare surges of +18% in competitive states.',
    stats: [
      { label: 'Total Rides', val: '3M+ (Lyft)' },
      { label: 'GA 2022 Surge', val: '+18%' },
      { label: 'Blue State E-Day Sales', val: '+79%' }
    ]
  },
  {
    icon: '🎰',
    bg: '#f0d5f0',
    title: 'Nevada Culinary Union',
    meta: 'Las Vegas, NV, 2016–present',
    body: 'Culinary Workers Union Local 226 organizes bus shuttles from Las Vegas Strip casinos to nearby vote centers. 57,000+ members, 55% women, 56% Latino, from 167 countries. Delivered 54,000 early votes in 2016, knocked on 370,000 doors in 2018.',
    stats: [
      { label: '2016 Early Votes', val: '54,000' },
      { label: '2018 Doors Knocked', val: '370,000' },
      { label: 'Member Countries', val: '167' }
    ]
  },
  {
    icon: '🏔️',
    bg: '#e8d5f0',
    title: 'Native American Reservations',
    meta: 'Montana, SD, AK, and others',
    body: 'Tribal members travel 30–100 miles to vote. Four Directions nearly doubled Native turnout in South Dakota. Voter participation on tribal lands runs 15 points below the national average in presidential elections. In Alaska, volunteers drive 2.5+ hours roundtrip.',
    stats: [
      { label: 'Presidential Gap', val: '-15 pp' },
      { label: 'Travel Distance', val: '30–100 mi' },
      { label: 'SD Impact', val: '~2x turnout' }
    ]
  },
  {
    icon: '🚌',
    bg: '#d5f0f0',
    title: 'Black Voters Matter Bus Tours',
    meta: '12 States, 2020–present',
    body: 'The "Blackest Bus in America" canvasses metro areas across the South and Midwest. The 2020 "WE GOT THE POWER" tour reached 7M+ people across 12 states. Bus stops include HBCUs, community centers, and urban neighborhoods in swing states.',
    stats: [
      { label: 'People Reached', val: '7M+' },
      { label: 'States Covered', val: '12' },
      { label: 'HBCU Stops', val: '10+' }
    ]
  }
];
