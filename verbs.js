'use strict';

// Irregular verbs from GANDALF\bagrut-5-yehidot\01-dikduk.txt (section 9).
(() => {
  const SIZE = 14;
  const ROUNDS = 7;
  const verbs = GDATA.verbs;
  const groups = Array.from({ length: Math.ceil(verbs.length / SIZE) }, (_, k) => verbs.slice(k * SIZE, (k + 1) * SIZE));
  const forms = (s) => s.split('/').map((x) => x.trim());

  Games.register({
    id: 'verbs',
    cat: 'grammar',
    icon: '⚔️',
    title: 'הפעלים החריגים',
    desc: `${U.en('go – went – gone')} – מקלידים את צורת העבר ואת V3.`,
    long: `${verbs.length} הפעלים החריגים מקובץ הדקדוק. מקבלים את בסיס הפועל ואת הפירוש, ומקלידים את <b>העבר</b> ואת <b>צורת V3</b>. אפשר לכתוב כל אחת משתי הצורות כשיש שתיים (burnt/burned).`,
    levels: groups.length,
    levelNames: groups.map((g) => `${g[0].base} – ${g[g.length - 1].base}`),
    play(stage, lvl, api) {
      const list = U.shuffle(groups[lvl]).slice(0, ROUNDS);
      let round = 0;
      let mistakes = 0;
      api.hint('הקלידו את שתי הצורות. Tab או Enter עוברים לשדה הבא.');

      function show() {
        api.rounds(round, list.length);
        const v = list[round];
        stage.innerHTML = `
          <div class="fade-in">
            <div class="verb-card">
              <div class="verb-base">${U.en(v.base)}</div>
              <div class="verb-he">${v.he}</div>
            </div>
            <form class="verb-form" id="vForm" autocomplete="off" dir="ltr">
              <label><small>past</small><input id="vPast" class="word-in" spellcheck="false" autocapitalize="off"></label>
              <label><small>V3</small><input id="vV3" class="word-in" spellcheck="false" autocapitalize="off"></label>
              <button class="btn" type="submit">בדיקה ✔</button>
            </form>
            <div id="vExplain"></div>
          </div>`;
        const past = stage.querySelector('#vPast');
        const v3 = stage.querySelector('#vV3');
        setTimeout(() => past.focus(), 50);
        past.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); v3.focus(); } };
        stage.querySelector('#vForm').onsubmit = (ev) => {
          ev.preventDefault();
          if (past.disabled) return;
          if (!past.value.trim() || !v3.value.trim()) { api.info('✏️ מלאו את שתי הצורות'); return; }
          const okP = forms(v.past).some((f) => U.norm(f) === U.norm(past.value));
          const okV = forms(v.v3).some((f) => U.norm(f) === U.norm(v3.value));
          past.disabled = v3.disabled = true;
          stage.querySelector('#vForm button').disabled = true;
          past.classList.add(okP ? 'right' : 'wrong');
          v3.classList.add(okV ? 'right' : 'wrong');
          if (okP && okV) api.good(null, stage.querySelector('.verb-card'));
          else { mistakes++; api.bad('הנה הצורות הנכונות', stage.querySelector('.verb-card')); }
          stage.querySelector('#vExplain').innerHTML = `
            <div class="explain"><b>${U.en(`${v.base} – ${v.past} – ${v.v3}`)}</b></div>
            <div class="row mt"><button class="btn" id="vNext">${round + 1 < list.length ? 'לפועל הבא ◀' : 'סיום 🏁'}</button></div>`;
          const nb = stage.querySelector('#vNext');
          nb.focus();
          nb.onclick = () => {
            Sound.click();
            round++;
            if (round < list.length) show();
            else {
              api.rounds(round, list.length);
              api.win(U.starsByMistakes(mistakes), `${list.length - mistakes} מתוך ${list.length} פעלים בלי טעות.`);
            }
          };
        };
      }
      show();
    },
  });
})();
