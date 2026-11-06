'use strict';

// Word games built from data.js (generated from the GANDALF guides).
(() => {
  const shortName = (s) => s.replace('מילים שמופיעות בהגדרות של מודול E', 'צירופים ופעלי מילית');

  Words.register({
    id: 'vocab_topics',
    cat: 'vocab',
    icon: '🗂️',
    title: 'מילים לפי נושא',
    desc: 'אוצר המילים של 5 יחידות: אופי, רגש, עבודה, חברה, בריאות, סביבה ועוד.',
    long: 'מילה באנגלית ← פירוש בעברית, ולהפך. בחלק מהשאלות מקלידים את המילה באנגלית, כמו בלי מילון במודול E.',
    groups: GDATA.bagrutVocab,
    rename: shortName,
  });

  Words.register({
    id: 'vocab_linkers',
    cat: 'vocab',
    icon: '🔗',
    title: 'מילות קישור וצירופים',
    desc: `${U.en('however, therefore, despite')} – המילים שמחזיקות כל טקסט.`,
    long: 'מילות הקישור חוזרות בכל טקסט של 5 יחידות. מי שמכיר אותן מבין מהר מה הכותב רוצה: ניגוד, סיבה, תוצאה או דוגמה.',
    groups: GDATA.linkers,
    typing: 0.15,
  });

  Words.register({
    id: 'ba_linguistics',
    cat: 'ba',
    icon: '🔬',
    title: 'מונחי בלשנות',
    desc: `${U.en('phoneme, morpheme, syntax')} – המילים של חקר השפה.`,
    long: 'המונחים של מבוא לבלשנות ומבוא ללשון האנגלית. אחרי כל שאלה מופיע הסבר קצר של המונח.',
    groups: GDATA.baLinguistics,
    typing: 0.15,
  });

  Words.register({
    id: 'ba_literature',
    cat: 'ba',
    icon: '📜',
    title: 'מונחי ספרות',
    desc: `${U.en('narrator, irony, sonnet')} – המילים שבהן מדברים על יצירה.`,
    long: 'סוגות, דמויות, עלילה, שירה, מחזה וקריאה ביקורתית.',
    groups: GDATA.baLiterature,
    typing: 0.15,
  });

  Words.register({
    id: 'ba_academic',
    cat: 'ba',
    icon: '✍️',
    title: 'מילים של מאמר',
    desc: `${U.en('argue, imply, evidence')} – המילים שחוזרות בכל מאמר אקדמי.`,
    long: 'אלה המילים שפוגשים כשקוראים מחקר וכשכותבים עבודה.',
    groups: GDATA.baAcademic,
    typing: 0.2,
  });
})();
