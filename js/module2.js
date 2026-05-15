/* ============================================================
   module2.js — Financial Runway
   Listens to module1Updated; also has its own inputs:
   savings and monthly-expenses slider
   ============================================================ */

(function () {
  'use strict';

  /* Module-level state set by module1Updated */
  let _typicalNet  = 0;
  let _stateData   = { maxWBA: 450, weeks: 26, taxRate: 0.05, name: 'California' };
  let _salary      = 75000;

  function fmt(n) {
    if (!isFinite(n) || n < 0) return '$0';
    return Math.round(n).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  }

  function fmtMonths(n) {
    if (!isFinite(n) || n <= 0) return '0.0';
    return n.toFixed(1);
  }

  /* ---------- Core calculation ---------- */
  function calc() {
    const savings  = parseFloat(document.getElementById('savings-input').value)  || 0;
    const expenses = parseFloat(document.getElementById('expenses-slider').value) || 3000;

    /* Unemployment insurance */
    const weeklyUI  = Math.min(_salary / 52 * 0.5, _stateData.maxWBA);
    const monthlyUI = weeklyUI * 4.33;
    const uiDurationMonths = _stateData.weeks / 4.33;

    /* Phase 1: Severance covers monthly expenses */
    const p1 = expenses > 0 ? _typicalNet / expenses : 0;

    /* Phase 2: Savings + UI cover the gap (capped at UI duration) */
    const monthlyDeficit = Math.max(expenses - monthlyUI, 0);
    let p2, savingsUsedP2;
    if (expenses <= monthlyUI) {
      /* UI alone covers expenses — save everything, run full UI clock */
      p2 = uiDurationMonths;
      savingsUsedP2 = 0;
    } else {
      p2 = Math.min(savings / monthlyDeficit, uiDurationMonths);
      savingsUsedP2 = p2 * monthlyDeficit;
    }

    /* Phase 3: Remaining savings after UI exhausted */
    const remainingSavings = Math.max(savings - savingsUsedP2, 0);
    const p3 = expenses > 0 ? remainingSavings / expenses : 0;

    const total = p1 + p2 + p3;

    renderResults({ total, p1, p2, p3, monthlyUI, weeklyUI, expenses, savings });

    /* Broadcast for cross-module use */
    document.dispatchEvent(new CustomEvent('module2Updated', {
      detail: { monthlyUI, weeklyUI, salary: _salary, stateData: _stateData }
    }));
  }

  /* ---------- Render ---------- */
  function renderResults({ total, p1, p2, p3, monthlyUI, weeklyUI, expenses }) {
    const card = document.getElementById('runway-card');
    const headline = document.getElementById('runway-headline');
    const sub = document.getElementById('runway-sub');

    /* Colour state */
    card.classList.remove('green', 'amber', 'red');
    if (total >= 6) {
      card.classList.add('green');
    } else if (total >= 3) {
      card.classList.add('amber');
    } else {
      card.classList.add('red');
    }

    /* Headline — number first */
    headline.textContent = `You have ${fmtMonths(total)} months of runway`;

    /* Sub line */
    const urgency = total >= 6
      ? 'You have time to be selective.'
      : total >= 3
        ? 'Start your search now and you can land well.'
        : 'Prioritize landing income quickly — every week matters.';
    sub.textContent = urgency;

    /* Phases */
    document.getElementById('runway-p1').textContent  = `${fmtMonths(p1)} mo`;
    document.getElementById('runway-p2').textContent  = `${fmtMonths(p2)} mo`;
    document.getElementById('runway-p3').textContent  = `${fmtMonths(p3)} mo`;

    /* UI note */
    document.getElementById('runway-ui-note').textContent =
      `Your estimated weekly unemployment benefit: ${fmt(weeklyUI)} ` +
      `(${fmt(monthlyUI)}/mo) offsets expenses in Phase 2.`;

    document.getElementById('m2-results').style.display = 'block';
  }

  /* ---------- Slider ↔ text sync ---------- */
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
  }

  function syncExpenses(source) {
    const slider = document.getElementById('expenses-slider');
    const text   = document.getElementById('expenses-text');
    if (source === 'slider') {
      text.value = slider.value;
    } else {
      let val = parseInt(text.value.replace(/[^0-9]/g, ''), 10) || 3000;
      val = Math.min(15000, Math.max(500, val));
      slider.value = val;
      text.value   = val;
    }
    updateSliderFill(slider);
    calc();
  }

  /* ---------- Listen to Module 1 updates ---------- */
  function onModule1Updated(e) {
    _typicalNet = e.detail.typicalNet  || 0;
    _stateData  = e.detail.stateData   || _stateData;
    _salary     = e.detail.salary      || 75000;
    calc();
  }

  /* ---------- Init ---------- */
  function init() {
    const expSlider = document.getElementById('expenses-slider');
    const expText   = document.getElementById('expenses-text');
    expText.value   = expSlider.value;
    updateSliderFill(expSlider);

    expSlider.addEventListener('input', () => syncExpenses('slider'));
    expText.addEventListener('input',   () => syncExpenses('text'));
    expText.addEventListener('blur',    () => syncExpenses('text'));

    document.getElementById('savings-input').addEventListener('input', calc);
    document.getElementById('savings-input').addEventListener('blur',  calc);

    document.addEventListener('module1Updated', onModule1Updated);
  }

  window.initModule2 = init;
})();
