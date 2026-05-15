/* ============================================================
   module1.js — Severance Estimator
   Inputs: salary, years, industry, seniority, state,
           mass-layoff checkbox, age-40+ checkbox
   Fires 'module1Updated' custom event for other modules
   ============================================================ */

(function () {
  'use strict';

  const INDUSTRY_MULT = {
    tech: 1.3, finance: 1.3, healthcare: 1.0,
    manufacturing: 0.9, government: 0.8, retail: 0.7, other: 1.0
  };

  const SENIORITY_MOD = {
    ic: 1.0, manager: 1.15, director: 1.3, vp: 1.5
  };

  const FEDERAL_TAX = 0.22;

  /* ---------- Helpers ---------- */
  function fmt(n) {
    if (!isFinite(n)) return '$0';
    return Math.round(n).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  }

  function getValues() {
    const salary     = parseFloat(document.getElementById('salary-slider').value) || 75000;
    const years      = parseFloat(document.getElementById('years-input').value)   || 0;
    const industry   = document.getElementById('industry-select').value;
    const seniority  = document.getElementById('seniority-select').value;
    const stateCode  = document.getElementById('state-select').value;
    const massLayoff = document.getElementById('mass-layoff-check').checked;
    const age40      = document.getElementById('age40-check').checked;
    return { salary, years, industry, seniority, stateCode, massLayoff, age40 };
  }

  /* ---------- Core calculation ---------- */
  function calc() {
    const { salary, years, industry, seniority, stateCode, massLayoff, age40 } = getValues();

    const stateData    = getStateData(stateCode);
    const industryMult = INDUSTRY_MULT[industry]  || 1.0;
    const seniorityMod = SENIORITY_MOD[seniority] || 1.0;

    const weeklyPay    = salary / 52;
    const lowWeeks     = years * 1.0;
    const typicalWeeks = Math.min(years * 1.5 * industryMult * seniorityMod, 52);
    const highWeeks    = Math.min(years * 2.5 * industryMult * seniorityMod, 52);

    const lowGross     = weeklyPay * lowWeeks;
    const typicalGross = weeklyPay * typicalWeeks;
    const highGross    = weeklyPay * highWeeks;

    const netRate      = Math.max(0, 1 - FEDERAL_TAX - stateData.taxRate);
    const lowNet       = lowGross    * netRate;
    const typicalNet   = typicalGross * netRate;
    const highNet      = highGross   * netRate;

    renderResults({
      salary, years, weeklyPay,
      lowWeeks, typicalWeeks, highWeeks,
      lowGross, typicalGross, highGross,
      lowNet, typicalNet, highNet,
      netRate, stateData, massLayoff, age40
    });

    /* Broadcast to other modules */
    document.dispatchEvent(new CustomEvent('module1Updated', {
      detail: {
        salary, stateCode, stateData,
        typicalNet, typicalGross,
        weeklyPay, years
      }
    }));
  }

  /* ---------- Render ---------- */
  function renderResults(d) {
    const taxPct = ((1 - d.netRate) * 100).toFixed(1);

    /* Severance cards */
    document.getElementById('sev-low-gross').textContent    = fmt(d.lowGross);
    document.getElementById('sev-low-net').textContent      = fmt(d.lowNet);
    document.getElementById('sev-low-math').textContent     =
      `${fmt(d.salary)} ÷ 52 × ${d.lowWeeks.toFixed(1)} wks = ${fmt(d.lowGross)} gross`;

    document.getElementById('sev-typical-gross').textContent = fmt(d.typicalGross);
    document.getElementById('sev-typical-net').textContent   = fmt(d.typicalNet);
    document.getElementById('sev-typical-math').textContent  =
      `${fmt(d.salary)} ÷ 52 × ${d.typicalWeeks.toFixed(1)} wks = ${fmt(d.typicalGross)} gross`;

    document.getElementById('sev-high-gross').textContent   = fmt(d.highGross);
    document.getElementById('sev-high-net').textContent     = fmt(d.highNet);
    document.getElementById('sev-high-math').textContent    =
      `${fmt(d.salary)} ÷ 52 × ${d.highWeeks.toFixed(1)} wks = ${fmt(d.highGross)} gross`;

    document.getElementById('sev-tax-note').textContent =
      `Net estimates after 22% federal + ${(d.stateData.taxRate * 100).toFixed(1)}% ${d.stateData.name} state tax (${taxPct}% combined)`;

    /* WARN Act flag */
    const warnFlag = document.getElementById('warn-flag');
    if (d.massLayoff) {
      warnFlag.classList.add('visible');
    } else {
      warnFlag.classList.remove('visible');
    }

    /* OWBPA flag */
    const owbpaFlag = document.getElementById('owbpa-flag');
    if (d.age40) {
      owbpaFlag.classList.add('visible');
    } else {
      owbpaFlag.classList.remove('visible');
    }

    /* Show result area */
    document.getElementById('m1-results').style.display = 'block';
  }

  /* ---------- Slider ↔ text sync ---------- */
  function syncSalary(source) {
    const slider = document.getElementById('salary-slider');
    const text   = document.getElementById('salary-text');

    if (source === 'slider') {
      text.value = slider.value;
    } else {
      let val = parseInt(text.value.replace(/[^0-9]/g, ''), 10) || 75000;
      val = Math.min(300000, Math.max(25000, val));
      slider.value = val;
      text.value   = val;
    }
    updateSliderFill(slider);
    calc();
  }

  /* Colour the filled portion of each range input */
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
  }

  /* ---------- Stepper controls ---------- */
  function initStepper() {
    const input = document.getElementById('years-input');
    document.getElementById('years-dec').addEventListener('click', () => {
      input.value = Math.max(0, (parseFloat(input.value) || 0) - 1);
      calc();
    });
    document.getElementById('years-inc').addEventListener('click', () => {
      input.value = Math.min(40, (parseFloat(input.value) || 0) + 1);
      calc();
    });
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      if (!isNaN(v)) input.value = Math.min(40, Math.max(0, Math.round(v)));
      calc();
    });
  }

  /* ---------- Populate state dropdown ---------- */
  function populateStateSelect() {
    const sel    = document.getElementById('state-select');
    const states = getStateSortedList();
    states.forEach(({ code, name }) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = name;
      sel.appendChild(opt);
    });
    /* Default to California */
    sel.value = 'CA';
  }

  /* ---------- Init ---------- */
  function init() {
    populateStateSelect();

    /* Salary slider */
    const slider = document.getElementById('salary-slider');
    const text   = document.getElementById('salary-text');
    text.value   = slider.value;
    updateSliderFill(slider);
    slider.addEventListener('input', () => syncSalary('slider'));
    text.addEventListener('input',   () => syncSalary('text'));
    text.addEventListener('blur',    () => syncSalary('text'));

    /* Years stepper */
    initStepper();

    /* Other selects and checkboxes */
    ['industry-select', 'seniority-select', 'state-select'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('change', calc);
    });

    document.getElementById('mass-layoff-check').addEventListener('change', calc);
    document.getElementById('age40-check').addEventListener('change', calc);

    /* Run on load */
    calc();
  }

  window.initModule1 = init;
})();
