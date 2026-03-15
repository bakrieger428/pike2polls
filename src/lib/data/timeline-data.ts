// Timeline data extracted from rides-to-polls source
export interface TimelineItem {
  year: string;
  era: 'early' | 'civil-rights' | 'modern' | 'rideshare';
  impact: 'normal' | 'high';
  tag: 'church' | 'legislation' | 'civil-rights' | 'controversy' | 'rideshare' | 'GOTV' | 'Research' | 'Scale' | 'Impact' | 'Legal';
  tagLabel: string;
  title: string;
  text: string;
}

export const timelineData: TimelineItem[] = [
  { year: '1758', era: 'early', impact: 'normal', tag: 'church', tagLabel: 'Origins',
    title: 'George Washington\'s "Treat" at the Polls',
    text: 'Washington provides 144 gallons of rum, punch, and cider to voters at Frederick County polls — an early example of candidates facilitating voter participation through incentives and transportation.' },
  { year: '1840s', era: 'early', impact: 'normal', tag: 'legislation', tagLabel: 'Political Machines',
    title: 'Tammany Hall\'s "Vote Hauling"',
    text: 'New York\'s Tammany Hall and similar political machines organize horse-drawn carriages to transport voters to polls. The practice of "cooping" — kidnapping and forcing men to vote repeatedly — also emerges.' },
  { year: '1891', era: 'early', impact: 'high', tag: 'legislation', tagLabel: 'Legislation',
    title: 'Michigan Bans Voter Transportation',
    text: 'Michigan passes a law prohibiting transportation of voters to polls, making it a crime to hire vehicles for that purpose. This law would remain on the books for 129 years until 2020.' },
  { year: '1955', era: 'civil-rights', impact: 'high', tag: 'civil-rights', tagLabel: 'Civil Rights',
    title: 'Rosa Parks & the Montgomery Transportation Network',
    text: 'Rosa Parks serves as dispatcher for the Montgomery Improvement Association\'s Transportation Committee. The volunteer car pool and church station wagon network connects Black residents while simultaneously getting voters to registration offices.' },
  { year: '1957', era: 'civil-rights', impact: 'normal', tag: 'civil-rights', tagLabel: 'Civil Rights',
    title: 'Prayer Pilgrimage for Freedom',
    text: '25,000 people are transported to the Lincoln Memorial where Martin Luther King Jr. delivers his "Give Us the Ballot" speech, calling for voting rights. Churches and civil rights organizations sponsor the transportation.' },
  { year: '1961', era: 'civil-rights', impact: 'high', tag: 'civil-rights', tagLabel: 'Civil Rights',
    title: 'Freedom Rides Begin',
    text: 'CORE organizes 13 activists to board interstate buses, testing desegregation. The Freedom Rides — met with firebombings and beatings — lead to federal desegregation of interstate transportation, contributing to the pathway to the Voting Rights Act.' },
  { year: '1965', era: 'civil-rights', impact: 'high', tag: 'legislation', tagLabel: 'Legislation',
    title: 'Selma Marches & Voting Rights Act',
    text: 'Three marches covering 54 miles from Selma to Montgomery. Viola Liuzzo is killed by KKK members while driving marchers home. The marches directly lead to the Voting Rights Act, signed August 6, 1965.' },
  { year: '1990s', era: 'modern', impact: 'high', tag: 'church', tagLabel: 'Souls to the Polls',
    title: '"Souls to the Polls" Emerges in Florida',
    text: 'Black churches in Florida develop the practice of organizing Sunday caravan rides from church services to early voting locations. The Sunday before Election Day becomes a high-turnout moment for Black communities.' },
  { year: '2008', era: 'modern', impact: 'high', tag: 'church', tagLabel: 'GOTV',
    title: 'Obama Campaign\'s Ground Game',
    text: 'Obama builds 800+ field offices with congregation captains coordinating rides. "Dry run" simulations test Election Day transportation logistics. Black voter turnout reaches historic highs. Iconic Souls to the Polls caravans in Cleveland and other cities.' },
  { year: '2012', era: 'modern', impact: 'normal', tag: 'controversy', tagLabel: 'Controversy',
    title: 'Florida Cuts Early Voting',
    text: 'Florida eliminates the Sunday before Election Day from early voting, widely seen as targeting Souls to the Polls. Black voters respond by increasing their early voting share. The restriction is later reversed.' },
  { year: '2014', era: 'rideshare', impact: 'normal', tag: 'rideshare', tagLabel: 'Rideshare Era',
    title: 'Lyft Launches Voting Access Program',
    text: 'Lyft becomes the first rideshare company to offer transportation assistance to voters, beginning its decade-long initiative that would eventually help more than 3 million people get to the polls.' },
  { year: '2016', era: 'rideshare', impact: 'normal', tag: 'rideshare', tagLabel: 'Research',
    title: 'CIRCLE Reveals Youth Transport Barriers',
    text: '29% of registered young non-voters cite lack of transportation as a factor. 38% of young people of color cite the same. These findings directly motivate 2018 rideshare programs.' },
  { year: '2018', era: 'rideshare', impact: 'high', tag: 'rideshare', tagLabel: 'Rideshare Era',
    title: 'Uber/Lyft Launch Major Election Day Programs',
    text: 'First year both companies offer rides to polls. Youth turnout doubles to 28% (from 13% in 2014). Harvard/BU study finds 30-point turnout gap between car-owning and non-car-owning voters.' },
  { year: '2020', era: 'rideshare', impact: 'normal', tag: 'legislation', tagLabel: 'Legislation',
    title: 'Michigan Repeals 129-Year Transportation Ban',
    text: 'Michigan finally repeals its 1891 law prohibiting transportation of voters to polls. 10 of the nation\'s largest transit systems offer free rides on Election Day for the first time.' },
  { year: '2021', era: 'rideshare', impact: 'high', tag: 'rideshare', tagLabel: 'Impact',
    title: 'Georgia Runoffs Flip the Senate',
    text: 'Unprecedented GOTV transportation programs in Georgia. Ossoff wins by ~55,000 votes, Warnock also wins. Black voters compose 32% of runoff electorate (up from 29%). Turnout drops only 10% from general — historically unprecedented.' },
  { year: '2021', era: 'rideshare', impact: 'normal', tag: 'legislation', tagLabel: 'Controversy',
    title: 'Georgia SB 202 Restricts Voting Buses',
    text: 'Georgia passes SB 202, restricting mobile voting buses and adding requirements for early voting. Widely criticized as targeting transportation-based GOTV programs in Black communities.' },
  { year: '2024', era: 'rideshare', impact: 'normal', tag: 'rideshare', tagLabel: 'Scale',
    title: 'Largest Rideshare Voting Programs Ever',
    text: 'Lyft and Uber both offer 50% off rides. NAACP partners with Lyft for $20 codes targeting 13.5M Black voters. 100,000 fewer polling places than 2020 make transportation more critical than ever.' },
  { year: '2025', era: 'rideshare', impact: 'high', tag: 'controversy', tagLabel: 'Legal',
    title: 'Georgia Rules Lyft Discounts Illegal',
    text: 'Georgia State Election Board votes 3-1 that Lyft\'s discounted rides violated state law against "paying for votes." Free rides from nonprofits ruled legal — only commercial discounts penalized. First ruling of its kind.' },
];
