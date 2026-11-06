'use strict';

// Sentence builder: put the words in the right order. Sentences follow the grammar topics in
// GANDALF\bagrut-5-yehidot\01-dikduk.txt
(() => {
  const LEVELS = [
    {
      name: 'סדר מילים ושאלות',
      tip: 'נושא + פועל + מושא + מקום + זמן. בשאלה: מילת שאלה + עזר + נושא + פועל.',
      s: [
        'We met Dana at the station at six.',
        'Where did you put the keys?',
        'She does not like coffee.',
        'There is a problem with the printer.',
        'Are you ready for the test?',
        'I often walk to school.',
        'She is often late for class.',
      ],
    },
    {
      name: 'זמנים ו-perfect',
      tip: 'since / for → present perfect. זמן סגור → past simple.',
      s: [
        'We have lived here since 2018.',
        'I was cooking when the phone rang.',
        'The film had already started when we arrived.',
        'She has visited Japan twice.',
        'I used to walk to school.',
        'By June I will have finished school.',
        'I have been waiting for an hour.',
      ],
    },
    {
      name: 'סביל ומודאלים',
      tip: 'סביל = be + V3. מודאל + have + V3 = על העבר.',
      s: [
        'The book was written by Orwell.',
        'English is spoken all over the world.',
        'The form must be signed by a parent.',
        'You should have told me the truth.',
        'She must have left early.',
        'The road will be built next year.',
        'The window is being repaired now.',
      ],
    },
    {
      name: 'תנאים ו-wish',
      tip: 'סוג 2: if + עבר, would. סוג 3: if + had + V3, would have + V3.',
      s: [
        'If it rains, we will stay home.',
        'If I had more time, I would travel.',
        'If I were you, I would apologize.',
        'If she had left earlier, she would have caught the bus.',
        'I wish I knew the answer.',
        'I wish I had told her.',
        'Unless you hurry, you will be late.',
      ],
    },
    {
      name: 'דיבור עקיף וזיקה',
      tip: 'בשאלה עקיפה – סדר של משפט רגיל, בלי do.',
      s: [
        'He asked me where I lived.',
        'She told me that she was ill.',
        'She told me not to shout.',
        'The woman who called you is my aunt.',
        'He missed the bus, which made him late.',
        'This is the house where I was born.',
        'I know a writer whose books are famous.',
      ],
    },
    {
      name: 'מבנים של 5 יחידות',
      tip: 'מילה שלילית בהתחלה → היפוך: Never have I...',
      s: [
        'Never have I seen such a thing.',
        'Not only did she win, but she also broke the record.',
        'I had my hair cut yesterday.',
        'It was Dana who called you.',
        'What I need is more time.',
        'Having finished the test, she left.',
        'No sooner had we arrived than the film started.',
      ],
    },
  ];
  const ROUNDS = 5;

  Games.register({
    id: 'builder',
    cat: 'grammar',
    icon: '🧱',
    title: 'בונה המשפטים',
    desc: 'המילים התפזרו! מסדרים אותן למשפט נכון באנגלית.',
    long: 'לוחצים על המילים לפי הסדר הנכון. כל שלב מתרגל נושא אחר בדקדוק: סדר מילים, זמנים, סביל, תנאים, דיבור עקיף, ובסוף המבנים של 5 יחידות.',
    levels: LEVELS.length,
    levelNames: LEVELS.map((l) => l.name),
    play(stage, lvl, api) {
      const L = LEVELS[lvl];
      const list = U.shuffle(L.s).slice(0, ROUNDS);
      let round = 0;
      let mistakes = 0;
      api.hint(`<b>${L.name}</b> – ${L.tip}`);

      function show() {
        api.rounds(round, list.length);
        const target = list[round].split(' ');
        let tiles;
        do { tiles = U.shuffle(target.map((t, k) => ({ t, k, used: false }))); }
        while (tiles.every((x, i) => x.t === target[i]));
        let answer = [];

        stage.innerHTML = `
          <div class="fade-in">
            <div class="sentence" id="bAns" dir="ltr"></div>
            <div class="tiles words" id="bTiles" dir="ltr"></div>
            <div class="row mt">
              <button class="btn secondary small" id="bClear">ניקוי ↺</button>
              <button class="btn" id="bCheck">בדיקה ✔</button>
            </div>
            <div id="bExplain"></div>
          </div>`;
        const $ = (s) => stage.querySelector(s);

        function paint() {
          $('#bAns').innerHTML = answer.length
            ? answer.map((x, i) => `<button class="tile word" data-i="${i}">${x.t}</button>`).join('')
            : '<span class="placeholder">לחצו על המילים לפי הסדר…</span>';
          $('#bTiles').innerHTML = tiles.map((x, i) =>
            `<button class="tile word ${x.used ? 'used' : ''}" data-i="${i}" ${x.used ? 'disabled' : ''}>${x.t}</button>`).join('');
        }

        $('#bTiles').onclick = (e) => {
          const b = e.target.closest('.tile');
          if (!b || $('#bCheck').disabled) return;
          const x = tiles[+b.dataset.i];
          x.used = true;
          answer.push(x);
          Sound.pop();
          paint();
        };
        $('#bAns').onclick = (e) => {
          const b = e.target.closest('.tile');
          if (!b || $('#bCheck').disabled) return;
          const i = +b.dataset.i;
          answer[i].used = false;
          answer.splice(i, 1);
          Sound.click();
          paint();
        };
        $('#bClear').onclick = () => {
          if ($('#bCheck').disabled) return;
          tiles.forEach((x) => { x.used = false; });
          answer = [];
          Sound.click();
          paint();
        };
        $('#bCheck').onclick = () => {
          if (answer.length < target.length) { api.info('✏️ השתמשו בכל המילים'); return; }
          const ok = answer.map((x) => x.t).join(' ') === target.join(' ');
          if (!ok) {
            mistakes++;
            api.bad('הסדר לא נכון עדיין. נסו שוב', $('#bAns'));
            if (mistakes % 3 !== 0) return;
          } else {
            api.good(null, $('#bAns'));
          }
          $('#bCheck').disabled = true;
          $('#bExplain').innerHTML = `
            <div class="explain">${ok ? '' : 'המשפט הנכון:<br>'}<b>${U.en(target.join(' '))}</b></div>
            <div class="row mt"><button class="btn" id="bNext">${round + 1 < list.length ? 'למשפט הבא ◀' : 'סיום 🏁'}</button></div>`;
          $('#bNext').onclick = () => {
            Sound.click();
            round++;
            if (round < list.length) show();
            else {
              api.rounds(round, list.length);
              api.win(U.starsByMistakes(mistakes), `בניתם ${list.length} משפטים.`);
            }
          };
        };
        paint();
      }
      show();
    },
  });
})();
