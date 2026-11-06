'use strict';

// Unscramble: rebuild an English word from its letters, with the Hebrew meaning as a clue.
(() => {
  const CFG = [
    { min: 4, max: 5 },
    { min: 5, max: 6 },
    { min: 6, max: 7 },
    { min: 7, max: 8 },
    { min: 8, max: 10 },
    { min: 10, max: 14 },
  ];
  const ROUNDS = 5;
  const all = GDATA.bagrutVocab.flatMap((g) => g.words)
    .map((w) => ({ ...w, word: Words.main(w.en).toLowerCase() }))
    .filter((w) => /^[a-z]+$/.test(w.word));

  Games.register({
    id: 'scramble',
    cat: 'games',
    icon: '🔀',
    title: 'מילים מבולבלות',
    desc: 'האותיות התערבבו! מסדרים אותן בחזרה למילה הנכונה.',
    long: 'מקבלים את הפירוש בעברית ואת האותיות מעורבבות. לוחצים על האותיות בסדר הנכון. בכל שלב המילים ארוכות יותר.',
    levels: CFG.length,
    levelNames: CFG.map((c) => `${c.min}–${c.max} אותיות`),
    play(stage, lvl, api) {
      const cfg = CFG[lvl];
      const list = U.shuffle(all.filter((w) => w.word.length >= cfg.min && w.word.length <= cfg.max)).slice(0, ROUNDS);
      let round = 0;
      let mistakes = 0;
      let hints = 0;
      api.hint('לוחצים על אות כדי להוסיף אותה. לוחצים על אות למעלה כדי להחזיר אותה. 💡 רמז חושף את האות הבאה.');

      function show() {
        api.rounds(round, list.length);
        const w = list[round];
        let letters;
        do { letters = U.shuffle(w.word.split('')); } while (letters.join('') === w.word && w.word.length > 1);
        const tiles = letters.map((ch, k) => ({ ch, k, used: false }));
        let answer = [];

        stage.innerHTML = `
          <div class="fade-in">
            <div class="verb-card"><div class="verb-he">${w.he}</div></div>
            <div class="slots" id="sSlots" dir="ltr"></div>
            <div class="tiles" id="sTiles" dir="ltr"></div>
            <div class="row mt">
              <button class="btn secondary small" id="sHint">💡 רמז</button>
              <button class="btn secondary small" id="sClear">ניקוי ↺</button>
            </div>
          </div>`;
        const $ = (s) => stage.querySelector(s);

        function paint() {
          $('#sSlots').innerHTML = w.word.split('').map((_, i) =>
            `<button class="slot ${answer[i] ? 'full' : ''}" data-i="${i}">${answer[i] ? answer[i].ch : ''}</button>`).join('');
          $('#sTiles').innerHTML = tiles.map((t) =>
            `<button class="tile ${t.used ? 'used' : ''}" data-k="${t.k}" ${t.used ? 'disabled' : ''}>${t.ch}</button>`).join('');
        }

        function check() {
          if (answer.length < w.word.length) return;
          const guess = answer.map((t) => t.ch).join('');
          if (guess === w.word) {
            api.good(`${w.en} = ${w.he}`, $('#sSlots'));
            stage.querySelectorAll('.slot').forEach((s) => s.classList.add('right'));
            setTimeout(() => {
              if (!api.alive()) return;
              round++;
              if (round < list.length) show();
              else {
                api.rounds(round, list.length);
                api.win(U.starsByMistakes(mistakes + Math.floor(hints / 2)), `סידרתם ${list.length} מילים.`);
              }
            }, 1100);
          } else {
            mistakes++;
            api.bad('לא המילה הזאת. נסו סדר אחר', $('#sSlots'));
          }
        }

        $('#sTiles').onclick = (e) => {
          const b = e.target.closest('.tile');
          if (!b || answer.length >= w.word.length) return;
          const t = tiles.find((x) => x.k === +b.dataset.k);
          t.used = true;
          answer.push(t);
          Sound.pop();
          paint();
          check();
        };
        $('#sSlots').onclick = (e) => {
          const b = e.target.closest('.slot');
          if (!b) return;
          const i = +b.dataset.i;
          if (!answer[i]) return;
          answer.slice(i).forEach((t) => { t.used = false; });
          answer = answer.slice(0, i);
          Sound.click();
          paint();
        };
        $('#sClear').onclick = () => {
          tiles.forEach((t) => { t.used = false; });
          answer = [];
          Sound.click();
          paint();
        };
        $('#sHint').onclick = () => {
          let i = 0;
          while (i < answer.length && answer[i].ch === w.word[i]) i++;
          if (i >= w.word.length) return;
          answer.slice(i).forEach((t) => { t.used = false; });
          answer = answer.slice(0, i);
          const t = tiles.find((x) => !x.used && x.ch === w.word[i]);
          t.used = true;
          answer.push(t);
          hints++;
          Sound.pop();
          paint();
          check();
        };
        paint();
      }
      show();
    },
  });
})();
