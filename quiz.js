'use strict';

// Shared quiz engine.
// Multiple choice: { q, a: [correct, ...wrong], e, he? }   – q and answers are English unless he: true
// Typed answer:    { q, ok: [accepted answers], show, e, input: true }
const QuizEngine = {
  text(s, he) { return he ? s : U.en(s); },

  // "___" in an English question becomes a visible blank.
  question(item) {
    if (item.he) return item.q;
    return U.en(item.q.replace(/___/g, '<span class="blank">_____</span>'));
  },

  play(stage, api, items, { hint = 'בחרו את התשובה הנכונה. אין לחץ של זמן 😊', winMsg } = {}) {
    let i = 0;
    let mistakes = 0;
    api.hint(hint);

    function next() {
      stage.querySelector('#qNext').onclick = () => {
        Sound.click();
        i++;
        if (i < items.length) show();
        else {
          api.rounds(i, items.length);
          const right = items.length - mistakes;
          api.win(mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1,
            (winMsg ? winMsg + ' ' : '') + `ענית נכון על ${right} מתוך ${items.length} שאלות.`);
        }
      };
    }

    function explain(item, prefix = '') {
      const e = item.e ? `<div class="solution">💡 ${item.e}</div>` : '';
      stage.querySelector('#qExplain').innerHTML = `
        <div class="explain">${prefix}${e}</div>
        <div class="row mt"><button class="btn" id="qNext">${i + 1 < items.length ? 'לשאלה הבאה ◀' : 'סיום 🏁'}</button></div>`;
      next();
    }

    function head(item) {
      return `
        ${item.s ? `<div class="quiz-scene">${item.s}</div>` : ''}
        ${item.tag ? `<div class="center"><span class="calc-tag">${item.tag}</span></div>` : ''}
        <div class="quiz-q">${QuizEngine.question(item)}</div>`;
    }

    function showInput(item) {
      stage.innerHTML = `
        <div class="fade-in">
          ${head(item)}
          <form class="num-entry" id="qForm" autocomplete="off">
            <input id="qIn" class="word-in" placeholder="type in English" dir="ltr" autocapitalize="off" spellcheck="false">
            <button class="btn" type="submit">בדיקה ✔</button>
          </form>
          <div class="num-note">באנגלית. אותיות גדולות או קטנות – לא משנה</div>
          <div id="qExplain"></div>
        </div>`;
      const input = stage.querySelector('#qIn');
      setTimeout(() => input.focus(), 50);
      stage.querySelector('#qForm').onsubmit = (ev) => {
        ev.preventDefault();
        if (input.disabled) return;
        const val = U.norm(input.value);
        if (!val) { api.info('✏️ הקלידו תשובה'); return; }
        input.disabled = true;
        stage.querySelector('#qForm button').disabled = true;
        if (item.ok.some((o) => U.norm(o) === val)) {
          input.classList.add('right');
          api.good(null, input);
          explain(item);
        } else {
          mistakes++;
          input.classList.add('wrong');
          api.bad('לא בדיוק – הנה התשובה', input);
          explain(item, `<div>התשובה: <b>${U.en(item.show || item.ok[0])}</b></div>`);
        }
      };
    }

    function show() {
      api.rounds(i, items.length);
      const item = items[i];
      if (item.input) { showInput(item); return; }
      const answers = U.shuffle(item.a.map((text, idx) => ({ text, ok: idx === 0 })));
      stage.innerHTML = `
        <div class="fade-in">
          ${head(item)}
          <div class="answers">
            ${answers.map((a, k) => `<button class="answer" data-k="${k}" style="animation-delay:${k * 0.07}s">${QuizEngine.text(a.text, item.ahe)}</button>`).join('')}
          </div>
          <div id="qExplain"></div>
        </div>`;
      stage.querySelector('.answers').onclick = (e) => {
        const b = e.target.closest('.answer');
        if (!b || b.disabled) return;
        const pick = answers[+b.dataset.k];
        stage.querySelectorAll('.answer').forEach((x, k) => {
          x.disabled = true;
          if (answers[k].ok) x.classList.add('right');
        });
        if (pick.ok) {
          api.good(null, b);
        } else {
          mistakes++;
          b.classList.add('wrong');
          api.bad('התשובה הנכונה מסומנת בירוק', b);
        }
        explain(item);
      };
    }
    show();
  },
};

// A "chapter by chapter" game: every level is one topic from the GANDALF guides.
// chapter: { name, qs: [items] }
const ChapterQuiz = {
  PER_ROUND: 8,

  register({ id, cat, icon, title, desc, long, chapters }) {
    Games.register({
      id, cat, icon, title, desc,
      long: long + ' <b>כל שלב הוא נושא</b>, ואפשר לבחור כל נושא בלי לפתוח את הקודם. בכל סבב השאלות מתערבבות מחדש.',
      levels: chapters.length,
      free: true,
      levelNames: chapters.map((c) => c.name),
      play(stage, lvl, api) {
        const ch = chapters[lvl];
        QuizEngine.play(stage, api, U.shuffle(ch.qs).slice(0, ChapterQuiz.PER_ROUND), {
          hint: `<b>${ch.name}</b> – קראו את כל המשפט לפני שבוחרים. אחרי כל שאלה יש הסבר.`,
        });
      },
    });
  },
};

// Word lists from data.js: { en, he, note }
const Words = {
  // The first form is what you type: "argue / argument" → "argue", "rise (v)" → "rise".
  main: (en) => en.split(' / ')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim(),
  accepted: (en) => en.split(' / ').map((s) => s.replace(/\s*\(.*?\)\s*/g, ' ').trim()),

  distractors(word, pool, key, n = 3) {
    const seen = new Set([word[key]]);
    const out = [];
    for (const w of U.shuffle(pool)) {
      if (out.length >= n) break;
      if (seen.has(w[key])) continue;
      seen.add(w[key]);
      out.push(w[key]);
    }
    return out;
  },

  noteHtml: (w) => `${U.en(w.en)} = ${w.he}${w.note ? `<br><small>${w.note}</small>` : ''}`,

  enToHe(w, pool) {
    return { q: w.en, a: [w.he, ...this.distractors(w, pool, 'he')], ahe: true, tag: '🇬🇧 → 🇮🇱 מה הפירוש?', e: this.noteHtml(w) };
  },
  heToEn(w, pool) {
    return { q: w.he, he: true, a: [w.en, ...this.distractors(w, pool, 'en')], tag: '🇮🇱 → 🇬🇧 איך אומרים באנגלית?', e: this.noteHtml(w) };
  },
  typed(w) {
    return { q: w.he, he: true, input: true, ok: this.accepted(w.en), show: w.en, tag: '⌨️ הקלידו באנגלית', e: this.noteHtml(w) };
  },

  // A round: mostly multiple choice, some typing. Typing is skipped for long phrases.
  round(words, pool, n = 8, { typing = 0.25 } = {}) {
    pool = pool.length >= 4 ? pool : words;
    return U.shuffle(words).slice(0, n).map((w, k) => {
      const canType = typing > 0 && Words.main(w.en).split(' ').length <= 2;
      const r = Math.random();
      if (canType && r < typing) return this.typed(w);
      return k % 2 ? this.heToEn(w, pool) : this.enToHe(w, pool);
    });
  },

  // A game where every level is one word group.
  register({ id, cat, icon, title, desc, long, groups, rename = (s) => s, typing = 0.25 }) {
    const all = groups.flatMap((g) => g.words);
    Games.register({
      id, cat, icon, title, desc,
      long: long + ` יש כאן <b>${all.length}</b> פריטים מתוך חומרי הלימוד. <b>כל שלב הוא קבוצה</b>, ואפשר לקפוץ לכל קבוצה.`,
      levels: groups.length,
      free: true,
      levelNames: groups.map((g) => rename(g.name)),
      play(stage, lvl, api) {
        const g = groups[lvl];
        QuizEngine.play(stage, api, Words.round(g.words, g.words.length >= 6 ? g.words : all, 8, { typing }), {
          hint: `<b>${rename(g.name)}</b> – ${g.words.length} פריטים בקבוצה. בכל סבב 8 מהם, בסדר אחר.`,
        });
      },
    });
  },
};
