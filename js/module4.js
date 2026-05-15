/* ============================================================
   module4.js — State Unemployment Benefits
   Auto-populated from Module 1 state + salary selection.
   No user inputs — purely derived output.
   ============================================================ */

(function () {
  'use strict';

  function fmt(n) {
    if (!isFinite(n) || n < 0) return '$0';
    return Math.round(n).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  }

  function fmtPct(n) {
    return (Math.min(n, 100)).toFixed(1) + '%';
  }

  function calc(salary, stateCode, stateData) {
    const weeklyPay     = salary / 52;
    const weeklyBenefit = Math.min(weeklyPay * 0.5, stateData.maxWBA);
    const monthlyBenefit = weeklyBenefit * 4.33;
    const totalMaxPayout = weeklyBenefit * stateData.weeks;
    const replacementRate = weeklyPay > 0 ? (weeklyBenefit / weeklyPay) * 100 : 0;

    renderResults({
      stateData, stateCode, salary, weeklyPay,
      weeklyBenefit, monthlyBenefit, totalMaxPayout, replacementRate
    });
  }

  function renderResults({
    stateData, salary, weeklyPay,
    weeklyBenefit, monthlyBenefit, totalMaxPayout, replacementRate
  }) {
    /* State name */
    document.getElementById('ui-state-name').textContent =
      stateData.name + ' Unemployment Insurance';

    /* Stats */
    document.getElementById('ui-weekly-benefit').textContent  = fmt(weeklyBenefit);
    document.getElementById('ui-weekly-sub').textContent      =
      `${fmt(monthlyBenefit)}/month · ${fmt(salary / 52)} weekly pay`;

    document.getElementById('ui-duration').textContent        = stateData.weeks + ' weeks';
    document.getElementById('ui-duration-sub').textContent    =
      `Maximum duration in ${stateData.name}`;

    document.getElementById('ui-total-payout').textContent    = fmt(totalMaxPayout);
    document.getElementById('ui-total-sub').textContent       =
      `${fmt(weeklyBenefit)} × ${stateData.weeks} weeks`;

    document.getElementById('ui-replacement').textContent     = fmtPct(replacementRate);
    document.getElementById('ui-replacement-sub').textContent =
      `of your ${fmt(weeklyPay)}/week pay`;

    /* Replacement bar */
    const fill = document.getElementById('ui-rep-fill');
    if (fill) fill.style.width = Math.min(replacementRate, 100) + '%';
    const pctLabel = document.getElementById('ui-rep-pct-label');
    if (pctLabel) pctLabel.textContent = fmtPct(replacementRate);

    /* Note about applying */
    document.getElementById('ui-apply-note').textContent =
      `Most states require you to file within 2–3 weeks of your last day. ` +
      `Apply at ${stateData.name}'s unemployment portal — do not wait.`;

    document.getElementById('m4-results').style.display = 'block';
  }

  /* ---------- Listen to Module 1 ---------- */
  function onModule1Updated(e) {
    const { salary, stateCode, stateData } = e.detail;
    if (stateCode && stateData) {
      calc(salary || 75000, stateCode, stateData);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    document.addEventListener('module1Updated', onModule1Updated);
    /* Module 4 has no independent inputs; results appear once Module 1 fires */
  }

  window.initModule4 = init;
})();
