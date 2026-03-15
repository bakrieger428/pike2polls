/* ═══════════════════════════════════════════════
   RIDES TO THE POLLS — Interactive Application
   ═══════════════════════════════════════════════ */

// ─── Theme Toggle ───
(function(){
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  function updateIcon() {
    if (!t) return;
    t.innerHTML = d === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateIcon();
  if (t) t.addEventListener('click', () => { d = d === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', d); updateIcon(); rebuildCharts(); rebuildMap(); });
})();

// ─── Nav scroll effect ───
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// ─── Animated Counters ───
function animateCount(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      animateCount(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── Helper: get computed CSS variable ───
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── CHARTS ───
let charts = {};
function destroyCharts() {
  Object.values(charts).forEach(c => c.destroy());
  charts = {};
}

function rebuildCharts() {
  destroyCharts();
  buildCharts();
}

function buildCharts() {
  const textColor = getCSSVar('--color-text');
  const textMuted = getCSSVar('--color-text-muted');
  const gridColor = getCSSVar('--color-divider');
  const demColor = getCSSVar('--color-dem');
  const repColor = getCSSVar('--color-rep');
  const primaryColor = getCSSVar('--color-primary');
  const accentColor = getCSSVar('--color-accent');
  const successColor = getCSSVar('--color-success');
  const warningColor = getCSSVar('--color-warning');

  Chart.defaults.font.family = "'Source Sans 3', sans-serif";
  Chart.defaults.color = textMuted;

  // Demographic Chart
  const demCtx = document.getElementById('demographicChart');
  if (demCtx) {
    charts.demographic = new Chart(demCtx, {
      type: 'bar',
      data: {
        labels: ['Low-income', 'Disabled', 'Non-white', 'No vehicle', 'Average'],
        datasets: [{
          label: 'Likelihood of using rideshare to vote (multiplier vs. avg)',
          data: [3.0, 2.5, 2.0, 2.0, 1.0],
          backgroundColor: [accentColor, warningColor, primaryColor, demColor, gridColor],
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.65,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}x more likely than average` } }
        },
        scales: {
          y: {
            beginAtZero: true, grid: { color: gridColor },
            ticks: { callback: v => v + 'x', color: textMuted },
            title: { display: true, text: 'Times more likely than average', color: textMuted, font: { size: 12 } }
          },
          x: { grid: { display: false }, ticks: { color: textMuted, font: { size: 12 } } }
        }
      }
    });
  }

  // Youth Turnout Chart
  const youthCtx = document.getElementById('youthChart');
  if (youthCtx) {
    charts.youth = new Chart(youthCtx, {
      type: 'bar',
      data: {
        labels: ['2010', '2014', '2018', '2022'],
        datasets: [{
          label: 'Youth Midterm Turnout (%)',
          data: [20, 13, 28, 23],
          backgroundColor: [primaryColor, primaryColor, accentColor, primaryColor],
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.55,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}% turnout` } }
        },
        scales: {
          y: {
            beginAtZero: true, max: 35, grid: { color: gridColor },
            ticks: { callback: v => v + '%', color: textMuted },
            title: { display: true, text: 'Youth Voter Turnout', color: textMuted, font: { size: 12 } }
          },
          x: { grid: { display: false }, ticks: { color: textMuted } }
        }
      }
    });
  }

  // Disability Chart
  const disCtx = document.getElementById('disabilityChart');
  if (disCtx) {
    charts.disability = new Chart(disCtx, {
      type: 'line',
      data: {
        labels: ['2012', '2016', '2018', '2020', '2022'],
        datasets: [
          {
            label: 'No Disability',
            data: [62.5, 59, 54.0, 69, 52.4],
            borderColor: demColor,
            backgroundColor: demColor + '20',
            fill: false, tension: 0.3, pointRadius: 5, borderWidth: 2.5,
          },
          {
            label: 'With Disability',
            data: [56.8, 53, 49.3, 62, 50.8],
            borderColor: accentColor,
            backgroundColor: accentColor + '20',
            fill: false, tension: 0.3, pointRadius: 5, borderWidth: 2.5,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, padding: 20, color: textMuted } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` } }
        },
        scales: {
          y: {
            min: 40, max: 75, grid: { color: gridColor },
            ticks: { callback: v => v + '%', color: textMuted },
            title: { display: true, text: 'Voter Turnout (%)', color: textMuted, font: { size: 12 } }
          },
          x: { grid: { display: false }, ticks: { color: textMuted } }
        }
      }
    });
  }

  // Reasons for not voting
  const reasonsCtx = document.getElementById('reasonsChart');
  if (reasonsCtx) {
    charts.reasons = new Chart(reasonsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Too busy (27%)', 'Not interested (18%)', 'Illness/disability (13%)', 'Out of town (8%)', 'Forgot (8%)', 'Didn\'t like candidates (6%)', 'Transportation (2%)', 'Registration issues (2%)', 'Inconvenient polling (2%)', 'Other (14%)'],
        datasets: [{
          data: [27, 18, 13, 8, 8, 6, 2, 2, 2, 14],
          backgroundColor: [
            '#6b7280', '#9ca3af', '#d1d5db',
            '#93c5fd', '#a5b4fc', '#c4b5fd',
            accentColor,
            '#fbbf24', '#fb923c', '#e5e7eb'
          ],
          borderWidth: 2,
          borderColor: getCSSVar('--color-surface-2'),
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { padding: 8, font: { size: 11 }, color: textMuted, usePointStyle: true } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}` } }
        },
      }
    });
  }

  // Rideshare surge chart
  const surgeCtx = document.getElementById('surgeChart');
  if (surgeCtx) {
    charts.surge = new Chart(surgeCtx, {
      type: 'bar',
      data: {
        labels: ['Georgia', 'Pennsylvania', 'Wisconsin', 'Arizona', 'Michigan', 'Nevada', 'New Mexico', 'Alaska'],
        datasets: [{
          label: 'Election Day ride increase (%)',
          data: [18, 12, 12, 10, 9, 5, 5, 5],
          backgroundColor: (ctx) => {
            const val = ctx.raw;
            return val >= 15 ? accentColor : val >= 10 ? primaryColor : demColor;
          },
          borderRadius: 6, borderSkipped: false, barPercentage: 0.6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `+${ctx.parsed.x}% rides vs. average` } }
        },
        scales: {
          x: {
            beginAtZero: true, grid: { color: gridColor },
            ticks: { callback: v => '+' + v + '%', color: textMuted },
          },
          y: { grid: { display: false }, ticks: { color: textMuted, font: { size: 12 } } }
        }
      }
    });
  }
}

// Build charts on load
buildCharts();

// ─── TIMELINE DATA ───
const timelineData = [
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

// ─── Build Timeline ───
function buildTimeline(filter = 'all') {
  const wrapper = document.getElementById('timelineWrapper');
  wrapper.innerHTML = '';
  const items = filter === 'all' ? timelineData : timelineData.filter(d => d.era === filter);
  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.dataset.impact = item.impact;
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-text">${item.text}</p>
      <span class="timeline-tag tag-${item.tag}">${item.tagLabel}</span>
    `;
    wrapper.appendChild(el);
  });
}
buildTimeline();

document.querySelectorAll('.era-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.era-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildTimeline(btn.dataset.era);
  });
});

// ─── US MAP (D3 + TopoJSON) ───
const stateData = {
  "Alabama": { status: "none", color: "muted", distance: 4.2, programs: "Souls to the Polls, BVM bus tours", notes: "No specific voter transport law" },
  "Alaska": { status: "none", color: "muted", distance: 8.1, programs: "Volunteer driver networks in rural areas", notes: "Remote communities face extreme distances" },
  "Arizona": { status: "none", color: "success", distance: 4.5, programs: "Rideshare2Vote active, tribal programs", notes: "No restrictions on voter transportation" },
  "Arkansas": { status: "none", color: "muted", distance: 4.8, programs: "Limited formal programs", notes: "No specific law" },
  "California": { status: "regulated", color: "warning", distance: 3.2, programs: "Uber restricted due to legal concerns", notes: "State legal questions limited Uber 2024 program" },
  "Colorado": { status: "none", color: "success", distance: 3.6, programs: "Universal mail-in voting reduces need", notes: "Primarily vote-by-mail state" },
  "Connecticut": { status: "none", color: "success", distance: 2.1, programs: "NAACP, local GOTV", notes: "No restrictions" },
  "Delaware": { status: "none", color: "success", distance: 2.3, programs: "Local church programs", notes: "No restrictions" },
  "Florida": { status: "none", color: "success", distance: 3.8, programs: "Souls to the Polls birthplace, major programs", notes: "Early voting targeted by restrictions in 2012, later restored" },
  "Georgia": { status: "restricted", color: "error", distance: 5.6, programs: "Fair Fight, New Georgia Project, Rideshare2Vote, Plus1Vote", notes: "SB 202 restricted voting buses; Election Board ruled Lyft discounts illegal (2025)" },
  "Hawaii": { status: "none", color: "success", distance: 2.8, programs: "Vote-by-mail state", notes: "Primarily mail-in voting" },
  "Idaho": { status: "none", color: "muted", distance: 5.2, programs: "Limited formal programs", notes: "No specific law" },
  "Illinois": { status: "none", color: "success", distance: 2.9, programs: "Chicago GOTV operations, union programs", notes: "No restrictions" },
  "Indiana": { status: "none", color: "muted", distance: 3.8, programs: "Local church and nonprofit programs", notes: "No specific voter transport law" },
  "Iowa": { status: "none", color: "muted", distance: 4.1, programs: "Limited formal programs", notes: "No specific law" },
  "Kansas": { status: "none", color: "muted", distance: 4.6, programs: "Limited formal programs", notes: "No specific law" },
  "Kentucky": { status: "none", color: "muted", distance: 4.3, programs: "BVM bus stops", notes: "No specific law" },
  "Louisiana": { status: "none", color: "muted", distance: 4.0, programs: "Power Coalition, BVM tours", notes: "No specific law" },
  "Maine": { status: "none", color: "success", distance: 3.4, programs: "Local volunteer programs", notes: "No restrictions" },
  "Maryland": { status: "none", color: "success", distance: 2.6, programs: "MTA free transit on Election Day (2024)", notes: "First free transit Election Day in 2024" },
  "Massachusetts": { status: "none", color: "success", distance: 2.0, programs: "Local GOTV programs", notes: "No restrictions" },
  "Michigan": { status: "none", color: "success", distance: 3.5, programs: "Harvard/BU study site; ban repealed 2020", notes: "Historic: banned voter transport 1891–2020 (129 years)" },
  "Minnesota": { status: "none", color: "success", distance: 3.3, programs: "Four Directions tribal program, satellite offices", notes: "No restrictions, tribal voting improvements" },
  "Mississippi": { status: "none", color: "muted", distance: 5.3, programs: "BVM bus tours", notes: "5.3 mi avg distance — among highest" },
  "Missouri": { status: "none", color: "muted", distance: 4.2, programs: "BVM bus stops", notes: "No specific law" },
  "Montana": { status: "none", color: "muted", distance: 7.2, programs: "Four Directions, Fort Peck tribal program", notes: "Tribal members travel 30–60 miles to vote" },
  "Nebraska": { status: "none", color: "muted", distance: 4.5, programs: "Limited formal programs", notes: "No specific law" },
  "Nevada": { status: "none", color: "success", distance: 3.9, programs: "Culinary Union casino shuttles, Rideshare2Vote", notes: "Major union-organized voter transport" },
  "New Hampshire": { status: "none", color: "success", distance: 2.8, programs: "Local programs", notes: "No restrictions" },
  "New Jersey": { status: "none", color: "success", distance: 2.2, programs: "NJ STTP expansion", notes: "No restrictions" },
  "New Mexico": { status: "none", color: "muted", distance: 5.8, programs: "Tribal voting programs", notes: "Ballot collection limits affect tribal lands" },
  "New York": { status: "none", color: "success", distance: 2.4, programs: "NYC GOTV programs, union operations", notes: "No restrictions" },
  "North Carolina": { status: "none", color: "muted", distance: 3.9, programs: "Souls to the Polls, BVM tours", notes: "Early voting restrictions debated" },
  "North Dakota": { status: "none", color: "muted", distance: 6.1, programs: "ND Native Vote, Four Directions", notes: "ID requirements affect tribal voters" },
  "Ohio": { status: "none", color: "muted", distance: 3.6, programs: "BVM tours, Cleveland STTP caravans", notes: "Early voting restrictions debated" },
  "Oklahoma": { status: "none", color: "muted", distance: 5.0, programs: "Limited formal programs", notes: "No specific law" },
  "Oregon": { status: "none", color: "success", distance: 3.0, programs: "Universal mail-in voting", notes: "All-mail election state since 2000" },
  "Pennsylvania": { status: "none", color: "success", distance: 3.1, programs: "Philadelphia GOTV, BVM tours, Rideshare2Vote", notes: "+12% Lyft surge in 2022" },
  "Rhode Island": { status: "none", color: "success", distance: 1.8, programs: "Local programs", notes: "Smallest state, short distances" },
  "South Carolina": { status: "none", color: "muted", distance: 4.4, programs: "BVM bus tours", notes: "No specific law" },
  "South Dakota": { status: "none", color: "muted", distance: 6.3, programs: "Four Directions doubled Native turnout", notes: "Aggressive tribal GOTV operations" },
  "Tennessee": { status: "none", color: "muted", distance: 4.1, programs: "BVM bus tours", notes: "No specific law" },
  "Texas": { status: "regulated", color: "warning", distance: 5.8, programs: "BVM tours, local GOTV", notes: "HB 521 (2025) requires disclosure for organized rides; longest avg distance (5.8 mi)" },
  "Utah": { status: "none", color: "success", distance: 3.7, programs: "Vote-by-mail option", notes: "Primarily mail-in voting" },
  "Vermont": { status: "none", color: "success", distance: 2.5, programs: "Local programs", notes: "No restrictions" },
  "Virginia": { status: "none", color: "success", distance: 3.0, programs: "Local GOTV programs", notes: "No restrictions" },
  "Washington": { status: "none", color: "success", distance: 3.1, programs: "Universal mail-in voting", notes: "All-mail state" },
  "West Virginia": { status: "none", color: "muted", distance: 4.8, programs: "Limited formal programs", notes: "Rural transportation challenges" },
  "Wisconsin": { status: "none", color: "success", distance: 3.2, programs: "STTP Wisconsin (450+ congregations), Four Directions", notes: "Milwaukee: highest turnout of 50 largest cities, 2024; +12% Lyft surge 2022" },
  "Wyoming": { status: "none", color: "muted", distance: 7.5, programs: "Limited formal programs", notes: "Sparse population, long distances" },
};

async function buildMap() {
  const container = document.getElementById('usMap');
  if (!container) return;
  container.innerHTML = '';

  const width = container.clientWidth;
  const height = width / 1.6;

  const svg = d3.select(container).append('svg')
    .attr('width', width).attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  const projection = d3.geoAlbersUsa().fitSize([width, height], { type: 'Sphere' });
  const path = d3.geoPath().projection(projection);

  try {
    const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
    const states = topojson.feature(us, us.objects.states);

    const colorMap = {
      success: getCSSVar('--color-success'),
      warning: getCSSVar('--color-warning'),
      error: getCSSVar('--color-error'),
      muted: getCSSVar('--color-text-faint'),
    };

    const tooltip = document.getElementById('mapTooltip');

    svg.selectAll('path')
      .data(states.features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => {
        const name = d.properties.name;
        const st = stateData[name];
        return st ? colorMap[st.color] || colorMap.muted : colorMap.muted;
      })
      .attr('stroke', getCSSVar('--color-bg'))
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s ease')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        const name = d.properties.name;
        const st = stateData[name];
        if (st) {
          tooltip.innerHTML = `
            <h4>${name}</h4>
            <div class="tt-stat"><span class="tt-label">Avg. Distance to Poll</span><span class="tt-value">${st.distance} mi</span></div>
            <div class="tt-stat"><span class="tt-label">Legal Status</span><span class="tt-value">${st.status === 'restricted' ? 'Restrictions' : st.status === 'regulated' ? 'Regulated' : 'No specific restriction'}</span></div>
            <div class="tt-stat"><span class="tt-label">Active Programs</span><span class="tt-value" style="text-align:right;max-width:180px">${st.programs}</span></div>
            <div style="margin-top:8px;font-size:12px;color:var(--color-text-muted)">${st.notes}</div>
          `;
          tooltip.classList.add('visible');
        }
      })
      .on('mousemove', function(event) {
        tooltip.style.left = (event.clientX + 16) + 'px';
        tooltip.style.top = (event.clientY - 10) + 'px';
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        tooltip.classList.remove('visible');
      });

    // State borders
    svg.append('path')
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr('fill', 'none')
      .attr('stroke', getCSSVar('--color-bg'))
      .attr('stroke-width', 1)
      .attr('d', path);

  } catch (e) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:40px">Map data loading... Please ensure you\'re connected to the internet.</p>';
  }
}

function rebuildMap() { buildMap(); }
buildMap();
window.addEventListener('resize', debounce(buildMap, 300));

function debounce(fn, ms) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

// ─── ELECTION IMPACT SIMULATOR ───
const electionPresets = {
  ga2021: { eligible: 7500000, baseTurnout: 60, noCarPct: 14, programReach: 35, conversion: 70, partisanLean: 68, origMargin: 55000 },
  ga2022: { eligible: 7700000, baseTurnout: 55, noCarPct: 14, programReach: 30, conversion: 65, partisanLean: 66, origMargin: 35000 },
  mi2018: { eligible: 7200000, baseTurnout: 58, noCarPct: 12, programReach: 20, conversion: 60, partisanLean: 62, origMargin: 405000 },
  nv2016: { eligible: 1900000, baseTurnout: 57, noCarPct: 10, programReach: 25, conversion: 65, partisanLean: 60, origMargin: 26000 },
  wi2024: { eligible: 4300000, baseTurnout: 72, noCarPct: 11, programReach: 40, conversion: 70, partisanLean: 64, origMargin: -30000 },
  custom: { eligible: 5000000, baseTurnout: 55, noCarPct: 12, programReach: 30, conversion: 65, partisanLean: 65, origMargin: 55000 },
};

function updateSimulator() {
  const eligible = parseInt(document.getElementById('simEligible').value);
  const baseTurnout = parseInt(document.getElementById('simBaseTurnout').value);
  const noCarPct = parseInt(document.getElementById('simNoCarPct').value);
  const programReach = parseInt(document.getElementById('simProgramReach').value);
  const conversion = parseInt(document.getElementById('simConversion').value);
  const partisanLean = parseInt(document.getElementById('simPartisanLean').value);
  const origMargin = parseInt(document.getElementById('simOrigMargin').value);

  // Update display values
  document.getElementById('simEligibleVal').textContent = eligible.toLocaleString();
  document.getElementById('simBaseTurnoutVal').textContent = baseTurnout + '%';
  document.getElementById('simNoCarPctVal').textContent = noCarPct + '%';
  document.getElementById('simProgramReachVal').textContent = programReach + '%';
  document.getElementById('simConversionVal').textContent = conversion + '%';
  document.getElementById('simPartisanLeanVal').textContent = partisanLean + '% Dem';
  document.getElementById('simOrigMarginVal').textContent = (origMargin >= 0 ? '+' : '') + origMargin.toLocaleString();

  // Calculate
  const noCarVoters = eligible * (noCarPct / 100);
  // Without program: no-car voters turn out at about 36% vs 66% (30-point gap)
  const baseNoCarTurnout = baseTurnout * (36 / 66);
  const servedVoters = noCarVoters * (programReach / 100);
  const additionalVoters = Math.round(servedVoters * (conversion / 100) * ((baseTurnout / 100) - (baseNoCarTurnout / 100)));
  const newTotalVoters = Math.round(eligible * (baseTurnout / 100)) + additionalVoters;
  const newTurnout = ((newTotalVoters / eligible) * 100).toFixed(1);

  const demShare = partisanLean / 100;
  const repShare = 1 - demShare;
  const netDemVotes = Math.round(additionalVoters * demShare);
  const netRepVotes = Math.round(additionalVoters * repShare);
  const netShift = netDemVotes - netRepVotes;
  const adjustedMargin = origMargin + netShift;

  document.getElementById('simAddlVoters').textContent = '+' + additionalVoters.toLocaleString();
  document.getElementById('simNewTurnout').textContent = newTurnout + '%';
  document.getElementById('simNetShift').textContent = '+' + netDemVotes.toLocaleString();
  document.getElementById('simNetShiftRep').textContent = '+' + netRepVotes.toLocaleString();
  document.getElementById('simOrigResult').textContent = (origMargin >= 0 ? 'D+' : 'R+') + Math.abs(origMargin).toLocaleString();
  document.getElementById('simAdjResult').textContent = (adjustedMargin >= 0 ? 'D+' : 'R+') + Math.abs(adjustedMargin).toLocaleString();

  // Color the adjusted result
  const adjEl = document.getElementById('simAdjResult');
  adjEl.style.color = adjustedMargin >= 0 ? getCSSVar('--color-dem') : getCSSVar('--color-rep');
  document.getElementById('simOrigResult').style.color = origMargin >= 0 ? getCSSVar('--color-dem') : getCSSVar('--color-rep');

  // Verdict
  const verdict = document.getElementById('simVerdict');
  const origWinner = origMargin >= 0 ? 'D' : 'R';
  const adjWinner = adjustedMargin >= 0 ? 'D' : 'R';
  if (origWinner !== adjWinner) {
    verdict.className = 'sim-verdict flipped';
    verdict.textContent = `The transportation program flips the result. Original: ${origWinner === 'D' ? 'Democratic' : 'Republican'} win → New: ${adjWinner === 'D' ? 'Democratic' : 'Republican'} win`;
  } else if (Math.abs(adjustedMargin) > Math.abs(origMargin) && origWinner === 'D') {
    verdict.className = 'sim-verdict widened';
    verdict.textContent = `Democratic margin widens by ${netShift.toLocaleString()} votes due to transportation program`;
  } else if (Math.abs(adjustedMargin) < Math.abs(origMargin) && origWinner === 'R') {
    verdict.className = 'sim-verdict narrowed';
    verdict.textContent = `Republican margin narrows by ${Math.abs(netShift).toLocaleString()} votes due to transportation program`;
  } else {
    verdict.className = 'sim-verdict narrowed';
    verdict.textContent = `Net shift of ${(netShift >= 0 ? '+' : '') + netShift.toLocaleString()} votes toward Democrats from the transportation program`;
  }

  // Bar visualization
  const totalVotesApprox = newTotalVoters;
  const baseDemPct = 50 + (origMargin / totalVotesApprox) * 50;
  const adjDemPct = 50 + (adjustedMargin / totalVotesApprox) * 50;
  const clampedDem = Math.max(15, Math.min(85, adjDemPct));
  const clampedRep = 100 - clampedDem;
  document.getElementById('simBarDem').style.width = clampedDem + '%';
  document.getElementById('simBarRep').style.width = clampedRep + '%';
  document.getElementById('simBarDemLabel').textContent = 'Dem';
  document.getElementById('simBarRepLabel').textContent = 'Rep';
  document.getElementById('simDemPct').textContent = clampedDem.toFixed(1) + '%';
  document.getElementById('simRepPct').textContent = clampedRep.toFixed(1) + '%';
}

// Preset selection
document.getElementById('simElection').addEventListener('change', (e) => {
  const preset = electionPresets[e.target.value];
  if (preset) {
    document.getElementById('simEligible').value = preset.eligible;
    document.getElementById('simBaseTurnout').value = preset.baseTurnout;
    document.getElementById('simNoCarPct').value = preset.noCarPct;
    document.getElementById('simProgramReach').value = preset.programReach;
    document.getElementById('simConversion').value = preset.conversion;
    document.getElementById('simPartisanLean').value = preset.partisanLean;
    document.getElementById('simOrigMargin').value = preset.origMargin;
    updateSimulator();
  }
});

// Bind sliders
['simEligible','simBaseTurnout','simNoCarPct','simProgramReach','simConversion','simPartisanLean','simOrigMargin'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateSimulator);
});

updateSimulator();

// ─── CASE STUDIES ───
const caseStudies = [
  {
    icon: '⛪', bg: '#f0e8d5', title: 'Souls to the Polls', meta: 'Florida → National, 1990s–present',
    body: 'Black church-led voter mobilization tradition. Church vans and buses transport congregants from Sunday services to early voting locations. Originated in Florida in the 1990s, now operates in cities across the country. Academic research found 3.5–12.4 percentage point turnout increases in targeted communities.',
    stats: [{ label: 'Turnout Increase', val: '3.5–12.4 pp' }, { label: 'Milwaukee 2024', val: '85% turnout' }, { label: 'WI Congregations', val: '450+' }]
  },
  {
    icon: '🍑', bg: '#d5f0e0', title: 'Georgia Runoffs 2021', meta: 'Georgia, January 2021',
    body: 'Unprecedented concentration of transportation programs. Rideshare2Vote, Plus1Vote (geofenced Uber rides in all 159 counties), Fair Fight, and New Georgia Project all operated simultaneously. Ossoff and Warnock wins flipped the US Senate.',
    stats: [{ label: 'Ossoff Margin', val: '~55,000 votes' }, { label: 'Black Electorate', val: '32%' }, { label: 'Turnout Drop vs. General', val: 'Only 10%' }]
  },
  {
    icon: '🚗', bg: '#d5e8f0', title: 'Uber/Lyft Election Programs', meta: 'National, 2014–present',
    body: 'Lyft has helped 3M+ people ride to the polls since 2014. Both companies offered 50% discounts in 2024. Research shows a 30-point turnout gap between car-owning and non-car-owning voters, and rideshare surges of +18% in competitive states.',
    stats: [{ label: 'Total Rides', val: '3M+ (Lyft)' }, { label: 'GA 2022 Surge', val: '+18%' }, { label: 'Blue State E-Day Sales', val: '+79%' }]
  },
  {
    icon: '🎰', bg: '#f0d5f0', title: 'Nevada Culinary Union', meta: 'Las Vegas, NV, 2016–present',
    body: 'Culinary Workers Union Local 226 organizes bus shuttles from Las Vegas Strip casinos to nearby vote centers. 57,000+ members, 55% women, 56% Latino, from 167 countries. Delivered 54,000 early votes in 2016, knocked on 370,000 doors in 2018.',
    stats: [{ label: '2016 Early Votes', val: '54,000' }, { label: '2018 Doors Knocked', val: '370,000' }, { label: 'Member Countries', val: '167' }]
  },
  {
    icon: '🏔️', bg: '#e8d5f0', title: 'Native American Reservations', meta: 'Montana, SD, AK, and others',
    body: 'Tribal members travel 30–100 miles to vote. Four Directions nearly doubled Native turnout in South Dakota. Voter participation on tribal lands runs 15 points below the national average in presidential elections. In Alaska, volunteers drive 2.5+ hours roundtrip.',
    stats: [{ label: 'Presidential Gap', val: '-15 pp' }, { label: 'Travel Distance', val: '30–100 mi' }, { label: 'SD Impact', val: '~2x turnout' }]
  },
  {
    icon: '🚌', bg: '#d5f0f0', title: 'Black Voters Matter Bus Tours', meta: '12 States, 2020–present',
    body: 'The "Blackest Bus in America" canvasses metro areas across the South and Midwest. The 2020 "WE GOT THE POWER" tour reached 7M+ people across 12 states. Bus stops include HBCUs, community centers, and urban neighborhoods in swing states.',
    stats: [{ label: 'People Reached', val: '7M+' }, { label: 'States Covered', val: '12' }, { label: 'HBCU Stops', val: '10+' }]
  },
];

function buildCases() {
  const grid = document.getElementById('casesGrid');
  grid.innerHTML = '';
  caseStudies.forEach(c => {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
      <div class="case-header">
        <div class="case-icon" style="background:${c.bg}">${c.icon}</div>
        <div>
          <div class="case-title">${c.title}</div>
          <div class="case-meta">${c.meta}</div>
        </div>
      </div>
      <div class="case-body">${c.body}</div>
      <div class="case-stats">
        ${c.stats.map(s => `<div class="case-stat"><span class="case-stat-val">${s.val}</span> ${s.label}</div>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}
buildCases();

// ─── Smooth scroll for nav links ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
