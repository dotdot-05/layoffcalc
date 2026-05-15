/* ============================================================
   module3.js — COBRA vs ACA Health Insurance Comparison
   Inputs: coverage type, monthly paycheck deduction (optional)
   Listens to module1Updated for post-layoff income estimate
   ============================================================ */

(function () {
  'use strict';

  /* Post-layoff income used for ACA band; updated from module1 */
  let _annualIncome = 40000;

  /* COBRA: employee share of premium by coverage tier */
  const EMPLOYEE_SHARE = { self: 0.17, spouse: 0.25, family: 0.26 };

  /* COBRA fallback monthly totals when no deduction entered */
  const COBRA_FALLBACK = { self: 760, spouse: 1390, family: 2173 };

  /* ACA estimated monthly premium midpoints by income band */
  const ACA_BANDS = [
    { max: 25000,  low: 0,   high: 50,  label: 'under $25K' },
    { max: 50000,  low: 50,  high: 200, label: '$25K–$50K' },
    { max: 75000,  low: 200, high: 500, label: '$50K–$75K' },
    { max: Infinity, low: 500, high: 900, label: 'over $75K' }
  ];

  function fmt(n) {
    if (!isFinite(n) || n < 0) return '$0';
    return Math.round(n).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  }

  function getACABand(income) {
    return ACA_BANDS.find(b => income < b.max) || ACA_BANDS[ACA_BANDS.length - 1];
  }

  function calc() {
    const coverage  = document.getElementById('coverage-select').value;       // self | spouse | family
    const deduction = parseFloat(document.getElementById('deduction-input').value) || 0;

    /* COBRA cost */
    let cobraCost;
    if (deduction > 0) {
      const share = EMPLOYEE_SHARE[coverage] || 0.17;
      cobraCost = (deduction / share) * 1.02;
    } else {
      cobraCost = COBRA_FALLBACK[coverage] || 760;
    }

    /* ACA cost */
    const band    = getACABand(_annualIncome);
    const acaMid  = (band.low + band.high) / 2;
    const acaLow  = band.low;
    const acaHigh = band.high;

    /* Monthly savings (positive = ACA cheaper) */
    const monthlySavings = cobraCost - acaMid;

    renderResults({ cobraCost, acaMid, acaLow, acaHigh, band, monthlySavings, coverage, deduction });
  }

  function renderResults({ cobraCost, acaMid, acaLow, acaHigh, band, monthlySavings, coverage }) {
    /* COBRA card */
    document.getElementById('cobra-price').textContent = `${fmt(cobraCost)}`;
    document.getElementById('cobra-desc').textContent =
      coverage === 'family'
        ? 'Full family premium (100%) + 2% COBRA admin fee'
        : coverage === 'spouse'
          ? 'Self + spouse premium (100%) + 2% COBRA admin fee'
          : 'Individual premium (100%) + 2% COBRA admin fee';

    /* ACA card */
    document.getElementById('aca-price').textContent = `${fmt(acaMid)}`;
    document.getElementById('aca-range').textContent = `${fmt(acaLow)}–${fmt(acaHigh)}/mo estimated`;
    document.getElementById('aca-desc').textContent =
      `Based on your income estimate (${band.label}). Subsidies reduce this if income is below 400% FPL.`;

    /* Savings note */
    const savingsEl = document.getElementById('cobra-savings');
    const annualSavings = Math.abs(monthlySavings) * 12;

    if (monthlySavings > 0) {
      savingsEl.className = 'cobra-savings-note';
      savingsEl.textContent =
        `ACA Marketplace could save you ~${fmt(monthlySavings)}/month (${fmt(annualSavings)}/year) vs COBRA`;
      /* Mark ACA as recommended */
      document.getElementById('cobra-card').classList.remove('recommended');
      document.getElementById('aca-card').classList.add('recommended');
      document.getElementById('cobra-rec-badge').style.display = 'none';
      document.getElementById('aca-rec-badge').style.display   = 'block';
    } else {
      savingsEl.className = 'cobra-savings-note negative';
      savingsEl.textContent =
        `COBRA may be worth it if you have pending claims — ACA Marketplace costs ~${fmt(Math.abs(monthlySavings))}/month more`;
      document.getElementById('cobra-card').classList.add('recommended');
      document.getElementById('aca-card').classList.remove('recommended');
      document.getElementById('cobra-rec-badge').style.display = 'block';
      document.getElementById('aca-rec-badge').style.display   = 'none';
    }

    document.getElementById('m3-results').style.display = 'block';
  }

  /* ---------- Listen to Module 1 for income ---------- */
  function onModule1Updated(e) {
    /* Post-layoff income ≈ annual salary (used for ACA subsidy estimate) */
    _annualIncome = e.detail.salary || 40000;
    calc();
  }

  /* ---------- Init ---------- */
  function init() {
    document.getElementById('coverage-select').addEventListener('change', calc);
    document.getElementById('deduction-input').addEventListener('input',  calc);
    document.getElementById('deduction-input').addEventListener('blur',   calc);
    document.addEventListener('module1Updated', onModule1Updated);
    calc();
  }

  window.initModule3 = init;
})();
