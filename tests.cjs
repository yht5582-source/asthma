// Rule tests for the decision engine embedded in index.html.
// Run: node tests.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/\/\*ENGINE-START\*\/([\s\S]*?)\/\*ENGINE-END\*\//);
if (!m) throw new Error('engine block not found');
const mod = { exports: {} };
new Function('module', m[1])(mod);
const AE = mod.exports;

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; console.log('  ✗ ' + name + '\n    ' + e.message); }
}
const init = o => AE.initial({ age: 'adult', days: '2', night: false, fev1: '', recentExac: false, acute: false, ...o });
const ok = { tech: true, adh: true, exp: true, comorb: true, dx: true };
const ctl = n => ({ day: n > 0, night: n > 1, rel: n > 2, act: n > 3 });
const on = o => AE.ongoing({ age: 'adult', track: 't2', step: 3, c1: 'icsform', ctl: ctl(0), exac: '0', fev1: '', stable: '0', checks: ok, ...o });

console.log('Symptom control (Box 2-2)');
t('0 items = well', () => assert.equal(AE.control(ctl(0)).level, 'well'));
t('2 items = partly', () => assert.equal(AE.control(ctl(2)).level, 'partly'));
t('3 items = uncontrolled', () => assert.equal(AE.control(ctl(3)).level, 'un'));

console.log('Initial treatment, adults/adolescents (Box 4-4)');
t('≤2 days/week → Step 1 (Track 1 Steps 1–2)', () => assert.equal(init({}).step, 1));
t('3 days/week → Step 2', () => assert.equal(init({ days: '3' }).step, 2));
t('most days → Step 3', () => assert.equal(init({ days: 'most' }).step, 3));
t('night waking alone → Step 3', () => assert.equal(init({ night: true }).step, 3));
t('FEV1 55% alone → Step 3', () => assert.equal(init({ fev1: '55' }).step, 3));
t('FEV1 65% (mildly reduced) with 3 days → Step 2', () => assert.equal(init({ days: '3', fev1: '65' }).step, 2));
t('daily symptoms without low LF or exacerbation → Step 3', () => assert.equal(init({ days: 'daily' }).step, 3));
t('daily + FEV1 55% → Step 4', () => assert.equal(init({ days: 'daily', fev1: '55' }).step, 4));
t('night waking + recent exacerbation → Step 4', () => assert.equal(init({ night: true, recentExac: true }).step, 4));
t('presenting in exacerbation → Step 4', () => assert.equal(init({ acute: true }).step, 4));
t('initial assessment never reaches Step 5', () => {
  for (const days of ['2', '3', 'most', 'daily']) for (const night of [true, false]) for (const fev1 of ['', '50', '90'])
    for (const recentExac of [true, false]) for (const acute of [true, false])
      for (const age of ['adult', 'adol', 'child'])
        assert.ok(AE.initial({ age, days, night, fev1, recentExac, acute }).step <= 4);
});
t('child presenting in exacerbation → Step 3 (then 3 or 4)', () => assert.equal(AE.initial({ age: 'child', days: '2', acute: true }).step, 3));

console.log('Ongoing treatment');
t('well controlled with allergic sensitization stays put (old bug sent this to Step 5)', () => {
  const o = on({ step: 1, track: 't2' });
  assert.equal(o.action, 'stay'); assert.equal(o.to, 1);
});
t('Track 2 Step 3 uncontrolled → up to Step 4', () => { const o = on({ ctl: ctl(3) }); assert.equal(o.action, 'up'); assert.equal(o.to, 4); });
t('Track 1 AIR-only uncontrolled → Step 3 MART', () => { const o = on({ track: 't1', step: 2, ctl: ctl(4) }); assert.equal(o.to, 3); });
t('Track 1 step 1 is normalised to Steps 1–2', () => assert.equal(on({ track: 't1', step: 1 }).from, 2));
t('partly controlled, no exacerbation → consider step-up', () => assert.equal(on({ ctl: ctl(1) }).action, 'consider'));
t('well-controlled symptoms but 1 exacerbation → step up', () => assert.equal(on({ exac: '1' }).action, 'up'));
t('exacerbation on Track 2 suggests Track 1 switch', () => assert.ok(on({ exac: '1' }).cautions.some(c => c.includes('Track 1'))));
t('poor technique → fix first, no step change', () => {
  const o = on({ step: 4, ctl: ctl(3), checks: { ...ok, tech: false } });
  assert.equal(o.action, 'fix'); assert.equal(o.to, 4); assert.equal(o.next, 5);
});
t('Step 5 uncontrolled → severe asthma pathway', () => assert.equal(on({ step: 5, ctl: ctl(3) }).action, 'severe'));
t('well controlled 3 months, Track 1 Step 3 → down to Steps 1–2', () => {
  const o = on({ track: 't1', step: 3, stable: '3' }); assert.equal(o.action, 'down'); assert.equal(o.to, 2);
});
t('well controlled 3 months at Track 2 Step 1 → stay, do not stop ICS', () => {
  const o = on({ step: 1, stable: '6' }); assert.equal(o.action, 'stay'); assert.ok(o.cautions.join().includes('ICS'));
});
t('well controlled but only 2 months → stay', () => assert.equal(on({ step: 4, stable: '2' }).action, 'stay'));
t('step-down with low FEV1 carries caution', () => assert.ok(on({ step: 4, stable: '4', fev1: '55' }).cautions.length > 0));
t('child Step 1 AIR (ICS-formoterol) uncontrolled → Step 3 MART', () => assert.equal(on({ age: 'child', step: 1, c1: 'icsform', ctl: ctl(3) }).to, 3));
t('child Step 1 ICS-SABA uncontrolled → Step 2', () => assert.equal(on({ age: 'child', step: 1, c1: 'combo', ctl: ctl(3) }).to, 2));

console.log('Regimens');
const kidText = s => { const r = AE.regimen('child', s, null); return r.pref.concat(r.other, [r.note]).join(' '); };
t('child regimens never use adult-only products or doses', () => {
  for (const s of [1, 2, 3, 4, 5]) {
    const x = kidText(s);
    for (const bad of ['160/4.5', 'Trelegy', 'Enerzair', 'Relvar', 'Trimbow', '250/50', 'tezepelumab', 'benralizumab'])
      assert.ok(!x.includes(bad), `Step ${s} mentions ${bad}`);
  }
});
t('child MART uses 80/4.5', () => assert.ok(kidText(3).includes('80/4.5') && kidText(4).includes('80/4.5')));
t('child Step 5 says MART not recommended', () => assert.ok(kidText(5).includes('不建議')));
t('adult Track 1 Steps 1 and 2 share AIR-only', () => assert.equal(AE.regimen('adult', 1).t1, AE.regimen('adult', 2).t1));
t('adult Track 1 Step 5 does not use a non-formoterol triple', () => assert.ok(!/Enerzair|Trelegy/.test(JSON.stringify(AE.regimen('adult', 5).t1))));
t('adult Track 2 Step 5 never recommends short OCS as controller', () => assert.ok(!/短期 OCS/.test(JSON.stringify(AE.regimen('adult', 5).t2))));
t('no "鎮痛" wording anywhere in page', () => assert.ok(!html.includes('鎮痛')));

console.log('Biologics – GINA (Box 8-4)');
const bg = o => AE.bioGina({ age: '45', exac: '2', eos: '', feno: '', ige: '', ocs: '0', feat: new Set(), ...o });
const cls = (r, k) => r.classes.find(c => c.k === k);
t('anti-TSLP eligible without biomarkers', () => assert.equal(cls(bg({}), 'tslp').ok, true));
t('anti-TSLP not for age 10', () => assert.equal(cls(bg({ age: '10' }), 'tslp').ok, false));
t('anti-IL5 needs eos ≥150', () => { assert.equal(cls(bg({ eos: '100' }), 'il5').ok, false); assert.equal(cls(bg({ eos: '300' }), 'il5').ok, true); });
t('anti-IL4R: eos 1600 without FeNO/OCS is not typical', () => assert.equal(cls(bg({ eos: '1600', feno: '10' }), 'il4').ok, false));
t('anti-IL4R: maintenance OCS qualifies', () => assert.equal(cls(bg({ ocs: '5' }), 'il4').ok, true));
t('eos ≥1500 raises EGPA warning; ≥300 raises parasite screen', () => {
  const w = bg({ eos: '1600' }).warn.map(x => x[1]).join();
  assert.ok(w.includes('1500') && w.includes('300'));
});
t('no exacerbation in past year → classes not eligible', () => assert.equal(cls(bg({ exac: '0', eos: '500' }), 'il5').ok, false));

console.log('Biologics – Taiwan NHI chapter 6');
const sample = { age: '45', smoke: 'no', exac: '3', er: true, ocs: '5', ocsm: '4', eos: '420', ige: '260', spec: true, hics: true, rev: true, optimal: true, ctlN: 3, feat: new Set(['sens']), sensKnown: true };
const nh = o => Object.fromEntries(AE.bioNhi({ ...sample, ...o }).map(r => [r.k, r.verdict]));
t('sample case: omalizumab, mepolizumab, benralizumab, tezepelumab meet; dupilumab needs 6 months OCS', () => {
  assert.deepEqual(nh({}), { oma: 'y', mepo: 'y', benra: 'y', dupi: 'n', teze: 'y' });
});
t('dupilumab met with 6 months OCS', () => assert.equal(nh({ ocsm: '6' }).dupi, 'y'));
t('eos 250 fails anti-IL5 and dupilumab', () => { const r = nh({ eos: '250' }); assert.equal(r.mepo, 'n'); assert.equal(r.dupi, 'n'); });
t('only 1 exacerbation fails mepo/benra/dupi/teze', () => { const r = nh({ exac: '1' }); for (const k of ['mepo', 'benra', 'dupi', 'teze']) assert.equal(r[k], 'n'); });
t('2 exacerbations but no ER/admission fails', () => assert.equal(nh({ er: false }).teze, 'n'));
t('age 10: benra/dupi/teze fail, mepo ok with 1 month OCS', () => {
  const r = nh({ age: '10', ocsm: '1' });
  assert.equal(r.benra, 'n'); assert.equal(r.dupi, 'n'); assert.equal(r.teze, 'n'); assert.equal(r.mepo, 'y');
});
t('age 16: dupilumab needs only 1 month OCS', () => assert.equal(nh({ age: '16', ocsm: '1' }).dupi, 'y'));
t('IgE 1500 fails omalizumab', () => assert.equal(nh({ ige: '1500' }).oma, 'n'));
t('current smoker ≥12 fails omalizumab; child branch has no smoking criterion', () => {
  assert.equal(nh({ smoke: 'cur' }).oma, 'n'); assert.equal(nh({ smoke: 'cur', age: '9' }).oma, 'y');
});
t('control <2 items fails omalizumab', () => assert.equal(nh({ ctlN: 1 }).oma, 'n'));
t('missing eosinophils → data insufficient, not fail', () => assert.equal(nh({ eos: '' }).mepo, 'q'));

console.log('Acute exacerbation (Box 9-4 / 9-6)');
const ac = o => ({ setting: 'ed', age: 'adult', wt: '60', ana: false, speech: 'sent', spo2: '96', rr: '18', pef: '80', pram: '',
  life: new Set(), mod: new Set(), red: new Set(), maint: 'none', prior: false, icu: false, resp: 'na', ...o });
const sev = o => AE.acuteSeverity(ac(o)).sev;
const txt = o => JSON.stringify(AE.acutePlan(ac(o)));
t('normal findings → mild', () => assert.equal(sev({}), 'mild'));
t('SpO2 93 → moderate', () => assert.equal(sev({ spo2: '93' }), 'moderate'));
t('PEF 60% → moderate', () => assert.equal(sev({ pef: '60' }), 'moderate'));
t('talks in phrases → moderate', () => assert.equal(sev({ speech: 'phr' }), 'moderate'));
t('accessory muscle use → moderate', () => assert.equal(sev({ mod: new Set(['access']) }), 'moderate'));
t('SpO2 91 → severe', () => assert.equal(sev({ spo2: '91' }), 'severe'));
t('RR 32 → severe', () => assert.equal(sev({ rr: '32' }), 'severe'));
t('PEF 45% → severe', () => assert.equal(sev({ pef: '45' }), 'severe'));
t('unable to speak → severe', () => assert.equal(sev({ speech: 'unable' }), 'severe'));
t('drowsy → life-threatening', () => assert.equal(sev({ life: new Set(['drowsy']) }), 'life'));
t('silent chest → life-threatening', () => assert.equal(sev({ life: new Set(['silent']) }), 'life'));
t('PRAM 9 in child → severe; PRAM 11 → life', () => {
  assert.equal(sev({ age: 'child', pram: '9' }), 'severe'); assert.equal(sev({ age: 'child', pram: '11' }), 'life');
});
t('PRAM ignored for adults', () => assert.equal(sev({ pram: '11' }), 'mild'));
t('anaphylaxis → epinephrine first', () => assert.equal(AE.acutePlan(ac({ ana: true })).tx[0][1], '先給 epinephrine'));
t('primary care severe → transfer', () => assert.ok(txt({ setting: 'pc', spo2: '90' }).includes('轉送')));
t('ED moderate → ipratropium with salbutamol', () => assert.ok(txt({ spo2: '93' }).includes('ipratropium 0.25 mg')));
t('ED severe → O2 92–95% and IV magnesium', () => { const x = txt({ spo2: '90' }); assert.ok(x.includes('92–95%') && x.includes('2 g')); });
t('ED life-threatening → 100% oxygen and call for help', () => { const x = txt({ life: new Set(['cyan']) }); assert.ok(x.includes('100%') && x.includes('麻醉')); });
t('child plan has no budesonide-formoterol 160/4.5', () => assert.ok(!txt({ age: 'child' }).includes('160/4.5')));
t('adult OCS 1 mg/kg capped at 50', () => { assert.ok(AE.ocsDose('adult', '80', 'pc').includes('50 mg/日')); assert.ok(AE.ocsDose('adult', '42', 'pc').includes('42 mg/日')); });
t('child OCS 1–2 mg/kg capped at 40; dexamethasone cap 12', () => {
  const x = AE.ocsDose('child', '30', 'pc'); assert.ok(x.includes('30–40 mg') && x.includes('9–12 mg'));
});
t('worsening in primary care → transfer', () => assert.equal(AE.acuteDispo(ac({ setting: 'pc', resp: 'worse' })).decision, 'transfer'));
t('marked improvement meeting all criteria → discharge', () => assert.equal(AE.acuteDispo(ac({ resp: 'marked', mildAfter: true, home: true, spo2b: '95', pefb: '75' })).decision, 'discharge'));
t('marked improvement but SpO2 90 → admit', () => assert.equal(AE.acuteDispo(ac({ resp: 'marked', mildAfter: true, home: true, spo2b: '90', pefb: '75' })).decision, 'admit'));
t('marked improvement, PEF 65 → not discharged', () => assert.notEqual(AE.acuteDispo(ac({ resp: 'marked', mildAfter: true, home: true, spo2b: '95', pefb: '65' })).decision, 'discharge'));
t('discharge: no ICS → start Step 4 MART for adults', () => assert.ok(AE.discharge(ac({ sev: 'moderate' })).join().includes('Step 4')));
t('discharge: child follow-up 2–5 days; adult 2–7 days', () => {
  assert.ok(AE.discharge(ac({ age: 'child', sev: 'moderate' })).join().includes('2–5 天'));
  assert.ok(AE.discharge(ac({ sev: 'moderate' })).join().includes('2–7 天'));
});
t('discharge: prior OCS exacerbation → refer', () => assert.ok(AE.discharge(ac({ prior: true, sev: 'moderate' })).join().includes('轉介專科')));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
