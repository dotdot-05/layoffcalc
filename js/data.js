/**
 * data.js — LayoffCalc state data
 * Sources: DOL UIPL notices, Tax Foundation 2025–2026, individual state agency sites.
 * maxWBA: maximum weekly benefit amount (USD, 2025–2026 schedule)
 * weeks:  maximum benefit duration (weeks)
 * taxRate: flat/effective marginal state income tax rate used for net-pay estimates
 */

const STATE_DATA = {
  AL: { name: 'Alabama',              maxWBA:  275, weeks: 26, taxRate: 0.0500 },
  AK: { name: 'Alaska',               maxWBA:  370, weeks: 26, taxRate: 0.0000 },
  AZ: { name: 'Arizona',              maxWBA:  320, weeks: 26, taxRate: 0.0250 }, // 2.5 % flat (2023+)
  AR: { name: 'Arkansas',             maxWBA:  451, weeks: 16, taxRate: 0.0440 }, // 4.4 % top rate (2024)
  CA: { name: 'California',           maxWBA:  450, weeks: 26, taxRate: 0.0930 },
  CO: { name: 'Colorado',             maxWBA:  781, weeks: 26, taxRate: 0.0440 }, // 4.40 % flat (2024)
  CT: { name: 'Connecticut',          maxWBA:  743, weeks: 26, taxRate: 0.0500 },
  DE: { name: 'Delaware',             maxWBA:  400, weeks: 26, taxRate: 0.0660 },
  DC: { name: 'Washington DC',        maxWBA:  444, weeks: 26, taxRate: 0.0850 },
  FL: { name: 'Florida',              maxWBA:  275, weeks: 12, taxRate: 0.0000 },
  GA: { name: 'Georgia',              maxWBA:  365, weeks: 26, taxRate: 0.0550 },
  HI: { name: 'Hawaii',               maxWBA:  695, weeks: 26, taxRate: 0.0800 },
  ID: { name: 'Idaho',                maxWBA:  448, weeks: 26, taxRate: 0.0580 },
  IL: { name: 'Illinois',             maxWBA:  742, weeks: 26, taxRate: 0.0495 }, // 4.95 % flat
  IN: { name: 'Indiana',              maxWBA:  390, weeks: 26, taxRate: 0.0305 }, // 3.05 % flat (2024)
  IA: { name: 'Iowa',                 maxWBA:  599, weeks: 26, taxRate: 0.0380 }, // 3.8 % flat (2025)
  KS: { name: 'Kansas',               maxWBA:  560, weeks: 26, taxRate: 0.0570 },
  KY: { name: 'Kentucky',             maxWBA:  626, weeks: 26, taxRate: 0.0400 }, // 4.0 % flat
  LA: { name: 'Louisiana',            maxWBA:  247, weeks: 26, taxRate: 0.0300 }, // reduced 2025
  ME: { name: 'Maine',                maxWBA:  531, weeks: 26, taxRate: 0.0750 },
  MD: { name: 'Maryland',             maxWBA:  430, weeks: 26, taxRate: 0.0575 },
  MA: { name: 'Massachusetts',        maxWBA: 1033, weeks: 30, taxRate: 0.0500 }, // 5 % flat; surtax excluded
  MI: { name: 'Michigan',             maxWBA:  362, weeks: 20, taxRate: 0.0425 },
  MN: { name: 'Minnesota',            maxWBA:  857, weeks: 26, taxRate: 0.0985 },
  MS: { name: 'Mississippi',          maxWBA:  235, weeks: 26, taxRate: 0.0500 },
  MO: { name: 'Missouri',             maxWBA:  320, weeks: 20, taxRate: 0.0480 }, // 4.8 % top (2024)
  MT: { name: 'Montana',              maxWBA:  571, weeks: 28, taxRate: 0.0590 }, // 5.9 % top (2024)
  NE: { name: 'Nebraska',             maxWBA:  440, weeks: 26, taxRate: 0.0664 },
  NV: { name: 'Nevada',               maxWBA:  469, weeks: 26, taxRate: 0.0000 },
  NH: { name: 'New Hampshire',        maxWBA:  427, weeks: 26, taxRate: 0.0000 }, // interest/dividend tax phased out
  NJ: { name: 'New Jersey',           maxWBA:  830, weeks: 26, taxRate: 0.0637 },
  NM: { name: 'New Mexico',           maxWBA:  511, weeks: 26, taxRate: 0.0590 },
  NY: { name: 'New York',             maxWBA:  504, weeks: 26, taxRate: 0.0685 },
  NC: { name: 'North Carolina',       maxWBA:  350, weeks: 12, taxRate: 0.0450 }, // 4.5 % flat (2024)
  ND: { name: 'North Dakota',         maxWBA:  618, weeks: 26, taxRate: 0.0195 }, // 1.95 % top (2024)
  OH: { name: 'Ohio',                 maxWBA:  647, weeks: 26, taxRate: 0.0350 },
  OK: { name: 'Oklahoma',             maxWBA:  539, weeks: 26, taxRate: 0.0475 },
  OR: { name: 'Oregon',               maxWBA:  783, weeks: 26, taxRate: 0.0990 },
  PA: { name: 'Pennsylvania',         maxWBA:  588, weeks: 26, taxRate: 0.0307 }, // 3.07 % flat
  RI: { name: 'Rhode Island',         maxWBA:  799, weeks: 26, taxRate: 0.0599 },
  SC: { name: 'South Carolina',       maxWBA:  326, weeks: 20, taxRate: 0.0640 }, // 6.4 % top (2024)
  SD: { name: 'South Dakota',         maxWBA:  414, weeks: 26, taxRate: 0.0000 },
  TN: { name: 'Tennessee',            maxWBA:  275, weeks: 26, taxRate: 0.0000 },
  TX: { name: 'Texas',                maxWBA:  563, weeks: 26, taxRate: 0.0000 },
  UT: { name: 'Utah',                 maxWBA:  600, weeks: 26, taxRate: 0.0465 }, // 4.65 % flat
  VT: { name: 'Vermont',              maxWBA:  583, weeks: 26, taxRate: 0.0875 },
  VA: { name: 'Virginia',             maxWBA:  378, weeks: 26, taxRate: 0.0575 },
  WA: { name: 'Washington',           maxWBA: 1079, weeks: 26, taxRate: 0.0000 },
  WV: { name: 'West Virginia',        maxWBA:  424, weeks: 26, taxRate: 0.0650 },
  WI: { name: 'Wisconsin',            maxWBA:  370, weeks: 26, taxRate: 0.0765 },
  WY: { name: 'Wyoming',              maxWBA:  508, weeks: 26, taxRate: 0.0000 },
};

/**
 * Returns the state entry for a given two-letter code.
 * Falls back to a safe default so calculators never crash on missing state.
 */
function getStateData(code) {
  return STATE_DATA[code] || { name: 'Unknown', maxWBA: 450, weeks: 26, taxRate: 0.05 };
}

/**
 * Returns an array of { code, name } sorted alphabetically by name,
 * suitable for populating a <select> element.
 */
function getStateSortedList() {
  return Object.entries(STATE_DATA)
    .map(([code, d]) => ({ code, name: d.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
