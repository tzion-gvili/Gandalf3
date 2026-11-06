'use strict';

// Pairs: match English words to Hebrew. Later levels are a memory game (cards face down).
(() => {
  const CFG = [
    { pairs: 5, memory: false },
    { pairs: 7, memory: false },
    { pairs: 9, memory: false },
    { pairs: 5, memory: true },
    { pairs: 7, memory: true },
    { pairs: 9, memory: true },
  ];
  const pool = () => GDATA.bagrutVocab.flatMap((g) => g.words).filter((w) => !w.en.includes(' ') && w.he.length <= 16);

  Games.register({
    id: 'match',
    cat: 'games',
    icon: '🃏',
    title: 'זוגות',
    desc: 'מחברים כל מילה באנגלית לפירוש שלה. בשלבים המתקדמים – משחק זיכרון!',
    long: 'לוחצים על מילה באנגלית ואז על הפירוש שלה בעברית. בשלבים 4–6 הקלפים <b>הפוכים</b> – צריך לזכור איפה כל אחד. המילים מתחלפות בכל משחק.',
    levels: CFG.length,
    levelIcons: ['🃏', '🃏', '🃏', '🧠', '🧠', '🧠'],
    play(stage, lvl, api) {
      const cfg = CFG[lvl];
      const words = [];
      const seenHe = new Set();
      for (const w of U.shuffle(pool())) {
        if (words.length >= cfg.pairs) break;
        if (seenHe.has(w.he)) continue;
        seenHe.add(w.he);
        words.push(w);
      }
      const cards = U.shuffle(words.flatMap((w, id) => [{ id, text: w.en, en: true }, { id, text: w.he, en: false }]));
      let first = null;
      let busy = false;
      let found = 0;
      let mistakes = 0;
      const allowed = cfg.memory ? cfg.pairs : Math.ceil(cfg.pairs / 2);

      api.hint(cfg.memory
        ? 'הפכו שני קלפים. אם הם זוג – הם נשארים פתוחים. נסו לזכור מה ראיתם 🧠'
        : 'לחצו על מילה ואז על הפירוש שלה. זוג נכון נעלם ✨');
      api.rounds(0, cfg.pairs);

      stage.innerHTML = `<div class="pairs ${cfg.memory ? 'memory' : ''}" id="pairs">
        ${cards.map((c, k) => `<button class="pcard ${c.en ? 'is-en' : 'is-he'}" data-k="${k}">
          <span class="pface">${c.en ? U.en(c.text) : c.text}</span><span class="pback">${MASCOT.icon}</span></button>`).join('')}
      </div>`;
      const els = [...stage.querySelectorAll('.pcard')];

      stage.querySelector('#pairs').onclick = (e) => {
        const b = e.target.closest('.pcard');
        if (!b || busy || b.classList.contains('gone')) return;
        const k = +b.dataset.k;
        if (first === b) { b.classList.remove('sel', 'open'); first = null; return; }
        Sound.click();
        b.classList.add('sel', 'open');
        if (!first) { first = b; return; }
        const a = cards[+first.dataset.k];
        const c = cards[k];
        const pairEls = [first, b];
        first = null;
        if (a.id === c.id && a.en !== c.en) {
          found++;
          api.rounds(found, cfg.pairs);
          Sound.correct();
          FX.burstAt(b);
          pairEls.forEach((x) => { x.classList.remove('sel'); x.classList.add('gone'); });
          if (found === cfg.pairs) {
            api.win(mistakes <= allowed / 2 ? 3 : mistakes <= allowed ? 2 : 1, `מצאתם את כל ${cfg.pairs} הזוגות עם ${mistakes} טעויות.`);
          }
        } else {
          mistakes++;
          busy = true;
          Sound.wrong();
          pairEls.forEach((x) => FX.shake(x));
          setTimeout(() => {
            pairEls.forEach((x) => x.classList.remove('sel', 'open'));
            busy = false;
          }, cfg.memory ? 900 : 450);
        }
      };
      return () => els.forEach((x) => { x.onclick = null; });
    },
  });
})();
