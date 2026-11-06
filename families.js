'use strict';

// Word families from GANDALF\bagrut-5-yehidot\04-bniyat-milim.txt
// Level 1–3: find the word that is NOT from the family. Level 4–6: build words with prefixes.
(() => {
  const ROUNDS = 7;
  const fams = GDATA.families.filter((f) => f.length >= 3);

  // Prefixes from the same guide: the right one is the first in each list.
  const PREFIX = [
    { w: 'happy', a: ['un', 'dis', 'im', 'mis'], e: 'unhappy – un = לא' },
    { w: 'possible', a: ['im', 'un', 'in', 'dis'], e: 'impossible – לפני p כותבים im' },
    { w: 'legal', a: ['il', 'un', 'in', 'dis'], e: 'illegal – לפני l כותבים il' },
    { w: 'regular', a: ['ir', 'un', 'in', 'dis'], e: 'irregular – לפני r כותבים ir' },
    { w: 'agree', a: ['dis', 'un', 'in', 'mis'], e: 'disagree – dis = היפוך' },
    { w: 'understand', a: ['mis', 'dis', 'un', 'in'], e: 'misunderstand – mis = לא נכון' },
    { w: 'write', a: ['re', 'pre', 'mis', 'dis'], e: 'rewrite – re = שוב' },
    { w: 'national', a: ['inter', 'sub', 'super', 'post'], e: 'international – inter = בין' },
    { w: 'estimate', a: ['under', 'dis', 'in', 'un'], e: 'underestimate – under = פחות מדי' },
    { w: 'crowded', a: ['over', 'under', 'mis', 'pre'], e: 'overcrowded – over = יותר מדי' },
    { w: 'operate', a: ['co', 'pre', 'dis', 'in'], e: 'cooperate – co = יחד' },
    { w: 'fiction', a: ['non', 'un', 'dis', 'im'], e: 'non-fiction – non = לא' },
    { w: 'honest', a: ['dis', 'un', 'im', 'ir'], e: 'dishonest' },
    { w: 'patient', a: ['im', 'un', 'in', 'dis'], e: 'impatient – לפני p כותבים im' },
    { w: 'visible', a: ['in', 'un', 'im', 'dis'], e: 'invisible' },
    { w: 'lingual', a: ['bi', 'co', 'sub', 'inter'], e: 'bilingual – bi = שניים' },
    { w: 'able', a: ['en', 'dis', 'un', 'im'], e: 'enable – en = לגרום, לאפשר' },
    { w: 'historic', a: ['pre', 'post', 're', 'sub'], e: 'prehistoric – pre = לפני' },
    { w: 'title', a: ['sub', 'super', 'inter', 'co'], e: 'subtitle – sub = מתחת' },
    { w: 'employed', a: ['un', 'dis', 'in', 'mis'], e: 'unemployed – מובטל' },
    { w: 'complete', a: ['in', 'un', 'dis', 'im'], e: 'incomplete' },
    { w: 'lead', a: ['mis', 'dis', 'un', 're'], e: 'mislead – להטעות' },
  ];

  const SUFFIX = [
    { q: 'kind → ___ (שם עצם)', a: ['kindness', 'kindment', 'kindity', 'kindful'], e: '-ness יוצר שם עצם: kindness' },
    { q: 'develop → ___ (שם עצם)', a: ['development', 'developness', 'developity', 'develoption'], e: '-ment יוצר שם עצם' },
    { q: 'decide → ___ (שם עצם)', a: ['decision', 'decidement', 'decideness', 'decidity'], e: '-sion / -tion יוצרים שם עצם' },
    { q: 'able → ___ (שם עצם)', a: ['ability', 'ableness', 'ablement', 'abletion'], e: '-ity יוצר שם עצם' },
    { q: 'care → ___ (בלי זהירות)', a: ['careless', 'careful', 'caring', 'carely'], e: '-less = בלי' },
    { q: 'use → ___ (מועיל)', a: ['useful', 'useless', 'usable', 'usely'], e: '-ful = מלא ב' },
    { q: 'danger → ___ (תואר)', a: ['dangerous', 'dangerful', 'dangery', 'dangerive'], e: '-ous יוצר תואר' },
    { q: 'create → ___ (תואר)', a: ['creative', 'creatous', 'createful', 'creatable'], e: '-ive יוצר תואר' },
    { q: 'quick → ___ (תואר הפועל)', a: ['quickly', 'quickful', 'quickness', 'quicken'], e: '-ly יוצר תואר הפועל' },
    { q: 'simple → ___ (פועל)', a: ['simplify', 'simplise', 'simplen', 'simplement'], e: '-ify יוצר פועל' },
    { q: 'strong → ___ (פועל)', a: ['strengthen', 'strongify', 'strongise', 'strongen'], e: '-en יוצר פועל: strengthen' },
    { q: 'modern → ___ (פועל)', a: ['modernise', 'modernify', 'modernen', 'modernity'], e: '-ise / -ize יוצר פועל' },
    { q: 'friend → ___ (מושג: חברות)', a: ['friendship', 'friendhood', 'friendness', 'friendity'], e: '-ship' },
    { q: 'child → ___ (ילדות)', a: ['childhood', 'childship', 'childness', 'childdom'], e: '-hood' },
    { q: 'free → ___ (חופש)', a: ['freedom', 'freeness', 'freehood', 'freement'], e: '-dom' },
    { q: 'The film was boring. I was ___.', a: ['bored', 'boring', 'bore', 'boredom'], e: '-ed על האדם. -ing על הדבר.' },
    { q: 'science → ___ (מדען)', a: ['scientist', 'sciencer', 'scientor', 'scientian'], e: '-ist לאנשים' },
    { q: 'invent → ___ (ממציא)', a: ['inventor', 'inventist', 'inventer', 'inventian'], e: '-or / -er לאנשים' },
  ];

  Games.register({
    id: 'families',
    cat: 'vocab',
    icon: '🌳',
    title: 'משפחות מילים',
    desc: `${U.en('act, action, active')} – מי לא שייך? ואיזו תחילית או סופית חסרה?`,
    long: 'הרבה מילים בבגרות הן אותה משפחה. בשלבים 1–2 מוצאים את המילה <b>שלא שייכת</b> למשפחה. בשלבים 3–4 בוחרים <b>תחילית</b> (un, dis, mis...). בשלבים 5–6 בוחרים <b>סופית</b> (-ness, -ful, -ify...).',
    levels: 6,
    levelNames: ['מי לא שייך? 1', 'מי לא שייך? 2', 'תחיליות 1', 'תחיליות 2', 'סופיות 1', 'סופיות 2'],
    play(stage, lvl, api) {
      let items;
      if (lvl < 2) {
        items = U.shuffle(fams).slice(0, ROUNDS).map((f) => {
          const others = fams.filter((g) => g !== f && !g.some((x) => f.includes(x)));
          const intruder = U.pick(U.pick(others));
          const shown = U.shuffle(f).slice(0, lvl === 0 ? 3 : 4);
          return {
            q: `${[...shown, intruder].sort(() => Math.random() - 0.5).join(' · ')}`,
            tag: '🌳 איזו מילה לא מהמשפחה?',
            a: [intruder, ...shown],
            e: `המשפחה: ${U.en(f.join(' – '))}`,
          };
        });
      } else if (lvl < 4) {
        items = U.shuffle(PREFIX).slice(0, ROUNDS).map((p) => ({
          q: `___${p.w}`, tag: '➕ איזו תחילית מתאימה?', a: p.a, e: p.e,
        }));
      } else {
        items = U.shuffle(SUFFIX).slice(0, ROUNDS).map((s) => ({ q: s.q, tag: '🔚 איזו מילה נכונה?', a: s.a, e: s.e }));
      }
      QuizEngine.play(stage, api, items, { hint: 'מזהים את הגרעין של המילה. התוספת אומרת את התפקיד.' });
    },
  });
})();
