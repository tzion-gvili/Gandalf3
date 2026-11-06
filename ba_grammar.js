'use strict';

// BA English grammar – topics follow GANDALF\toar-rishon-anglit\01-dikduk.txt
(() => {
  const CHAPTERS = [
    {
      name: 'מילה, צירוף, פסוקית, משפט',
      qs: [
        { he: true, q: 'יש בה נושא ונשוא, גם אם היא תלויה. מה זה?', a: ['clause', 'phrase', 'word', 'sentence'], e: 'clause = פסוקית. because the bridge was old.' },
        { he: true, q: 'יש לו ראש, ואין בו נשוא משלו. <span class="en">the old bridge</span>', a: ['phrase', 'clause', 'sentence', 'predicate'], e: 'phrase = צירוף.' },
        { q: 'I stayed home because I was ill.', tag: 'איזה סוג משפט?', a: ['complex sentence', 'simple sentence', 'compound sentence', 'phrase'], e: 'פסוקית ראשית + פסוקית תלויה = complex.' },
        { q: 'She studied hard, but she failed.', tag: 'איזה סוג משפט?', a: ['compound sentence', 'complex sentence', 'simple sentence', 'fragment'], e: 'שתי פסוקיות שוות עם but = compound.' },
        { q: 'The bus arrived late.', tag: 'איזה סוג משפט?', a: ['simple sentence', 'compound sentence', 'complex sentence', 'compound-complex sentence'], e: 'פסוקית אחת = simple.' },
        { he: true, q: 'פסוקית שלא יכולה לעמוד לבד נקראת:', a: ['subordinate clause', 'main clause', 'coordinate clause', 'noun phrase'], e: 'subordinate = כפופה, תלויה.' },
        { he: true, q: 'and מחבר דברים שווים. איך קוראים לזה?', a: ['coordination', 'subordination', 'embedding', 'inversion'], e: 'coordination = איחוי.' },
        { he: true, q: 'שני משפטים מחוברים וגם פסוקית תלויה:', a: ['compound-complex', 'complex', 'compound', 'simple'], e: 'compound-complex – גם וגם.' },
      ],
    },
    {
      name: 'חלקי הדיבר',
      qs: [
        { he: true, q: 'המילים <span class="en">a, the, this, every, my</span> הן:', a: ['determiners', 'adverbs', 'conjunctions', 'particles'], e: 'determiner = מגדיר. רחב יותר מ-article.' },
        { he: true, q: '<span class="en">that</span> ב-<span class="en">I know that she left</span> הוא:', a: ['complementizer', 'relative pronoun', 'determiner', 'preposition'], e: 'complementizer פותח פסוקית משלימה: that, whether, if.' },
        { he: true, q: '<span class="en">up</span> ב-<span class="en">give up</span> נקרא:', a: ['particle', 'preposition', 'adverb of place', 'determiner'], e: 'particle = מילית בפועל מילית.' },
        { he: true, q: 'מילים כמו <span class="en">the, of, and, to</span> נקראות:', a: ['function words', 'content words', 'open class', 'lexemes'], e: 'function words – מילות תפקיד. הדקדוק יושב עליהן.' },
        { he: true, q: 'שם, פועל ותואר – אפשר להמציא חדשים. זה:', a: ['open class', 'closed class', 'function words', 'particles'], e: 'open class. כינויים ומילות יחס הם closed class.' },
        { q: 'She sang beautifully.', tag: 'מה החלק של beautifully?', a: ['adverb', 'adjective', 'determiner', 'noun'], e: 'adverb – מתאר את הפועל.' },
        { q: 'Despite the rain, we left.', tag: 'מה החלק של despite?', a: ['preposition', 'conjunction', 'adverb', 'complementizer'], e: 'despite + שם = preposition.' },
        { q: 'Although it rained, we left.', tag: 'מה החלק של although?', a: ['conjunction', 'preposition', 'determiner', 'particle'], e: 'although + פסוקית = conjunction (subordinating).' },
      ],
    },
    {
      name: 'זמן, היבט, מודוס, סביל',
      qs: [
        { he: true, q: 'כמה זמנים דקדוקיים (tense) יש באנגלית לפי הגישה הצרה?', a: ['two: present and past', 'three: past, present, future', 'twelve', 'four'], e: 'present ו-past. will הוא modal.' },
        { he: true, q: '<span class="en">be + -ing</span> הוא:', a: ['progressive aspect', 'perfect aspect', 'passive voice', 'subjunctive mood'], e: 'progressive – הפעולה פרושה כמתמשכת.' },
        { he: true, q: '<span class="en">have + V3</span> הוא:', a: ['perfect aspect', 'progressive aspect', 'past tense', 'imperative'], e: 'perfect – קודם לנקודה.' },
        { q: 'The book was written in 1922.', tag: 'מה זה?', a: ['passive voice', 'active voice', 'progressive aspect', 'subjunctive'], e: 'be + V3 = passive.' },
        { he: true, q: 'פועל עם זמן ונושא (<span class="en">she writes</span>) הוא:', a: ['finite', 'non-finite', 'gerund', 'infinitive'], e: 'finite. to write / writing / written הם non-finite.' },
        { he: true, q: '<span class="en">be, seem, become</span> שקושרים נושא לתיאור נקראים:', a: ['copula', 'transitive verbs', 'modal verbs', 'phrasal verbs'], e: 'copula – פועל חיבור.' },
        { he: true, q: '<span class="en">Swimming is hard.</span> – swimming הוא:', a: ['gerund', 'present participle', 'infinitive', 'past participle'], e: 'ing כשם = gerund.' },
        { he: true, q: 'פועל מצב כמו <span class="en">know, own</span> נקרא:', a: ['stative verb', 'dynamic verb', 'auxiliary', 'copula'], e: 'stative – לא אוהב progressive.' },
        { he: true, q: 'יחס הדובר לעובדה (ציווי, מצב מדומה) הוא:', a: ['mood', 'tense', 'aspect', 'voice'], e: 'mood: indicative, imperative, subjunctive.' },
      ],
    },
    {
      name: 'מי משתתף בפועל',
      qs: [
        { q: 'She wrote me a letter.', tag: 'מה התפקיד של me?', a: ['indirect object', 'direct object', 'subject', 'adjunct'], e: 'me = indirect object. a letter = direct object.' },
        { q: 'She wrote a letter yesterday.', tag: 'מה התפקיד של yesterday?', a: ['adjunct', 'complement', 'object', 'argument'], e: 'adjunct – אפשר למחוק והמשפט חי.' },
        { q: 'She is a doctor.', tag: 'מה התפקיד של a doctor?', a: ['complement', 'direct object', 'adjunct', 'subject'], e: 'complement – השלמה הכרחית אחרי copula.' },
        { he: true, q: 'פועל בלי מושא, כמו <span class="en">arrive, sleep</span>:', a: ['intransitive', 'transitive', 'ditransitive', 'linking'], e: 'intransitive = עומד.' },
        { he: true, q: 'פועל עם שני מושאים, כמו <span class="en">give someone something</span>:', a: ['ditransitive', 'intransitive', 'copula', 'stative'], e: 'ditransitive.' },
        { he: true, q: 'משתתף שהפועל דורש (נושא, מושא) נקרא:', a: ['argument', 'adjunct', 'modifier', 'determiner'], e: 'argument. adjunct הוא לא argument.' },
        { q: 'The list of books is long.', tag: 'מה הנושא שהפועל מתאים לו?', a: ['list', 'books', 'long', 'of books'], e: 'הנושא הוא list, לכן is ולא are.' },
      ],
    },
    {
      name: 'פסוקיות תלויות ו-subjunctive',
      qs: [
        { q: 'They suggested that he ___ early.', a: ['leave', 'leaves', 'left', 'will leave'], e: 'subjunctive אחרי suggest / demand / insist: בסיס, בלי s.' },
        { q: 'It is essential that the term ___ defined.', a: ['be', 'is', 'was', 'being'], e: 'subjunctive: be.' },
        { q: 'My tutor, who is new, is strict.', tag: 'איזו פסוקית זיקה?', a: ['non-restrictive', 'restrictive', 'complement clause', 'adverbial clause'], e: 'עם פסיקים, תוספת = non-restrictive.' },
        { q: 'The students who passed may leave.', tag: 'איזו פסוקית זיקה?', a: ['restrictive', 'non-restrictive', 'sentential', 'absolute'], e: 'בלי פסיקים, מגדירה = restrictive.' },
        { q: 'a theory ___ proof is weak', a: ['whose', 'which', "who's", 'that its'], e: 'whose – שייכות, גם לדברים.' },
        { q: 'the person ___ we met', tag: 'רשמי', a: ['whom', 'who\'s', 'whose', 'which'], e: 'whom – מושא, רשמי.' },
        { q: 'He refused, which surprised us.', tag: 'איזה which זה?', a: ['sentential which', 'restrictive which', 'interrogative which', 'determiner which'], e: 'which על כל המשפט שלפניו.' },
        { q: 'What she wrote matters.', tag: 'מה זו What she wrote?', a: ['noun clause', 'relative clause', 'adverbial clause', 'phrase'], e: 'פסוקית שתופסת מקום של שם (נושא).' },
        { q: 'If I ___ the editor, I would cut the chapter.', a: ['were', 'am', 'will be', 'be'], e: 'מצב מדומה: were.' },
      ],
    },
    {
      name: 'פיסוק וטעויות כתיבה',
      qs: [
        { q: 'The scene is brief, it carries the theme.', tag: 'מה הבעיה?', a: ['comma splice', 'dangling participle', 'fragment', 'nothing'], e: 'פסיק לבד בין שני משפטים מלאים = comma splice.' },
        { q: 'Walking home, the rain started.', tag: 'מה הבעיה?', a: ['dangling participle', 'comma splice', 'wrong tense', 'nothing'], e: 'הגשם לא הלך. הנושא מתחלף = dangling participle.' },
        { he: true, q: 'איזה תיקון נכון ל-<span class="en">The scene is brief, it carries the theme.</span>?', a: ['The scene is brief; it carries the theme.', 'The scene is brief, however it carries the theme.', 'The scene, is brief it carries the theme.', 'The scene is brief, it, carries the theme.'], e: 'נקודה-פסיק, נקודה, או פסיק + and.' },
        { q: 'The scene is brief. ___, it carries the theme.', a: ['However', 'But,', 'Although', 'Despite'], e: 'However בתחילת משפט, עם פסיק אחריו.' },
        { q: "James___ novel", tag: 'שייכות', a: ["'s", "s'", 's', "'"], e: "שמות על s: James's novel." },
        { q: 'One image remains___ the empty chair.', a: [':', ';', ',', '.'], e: 'נקודתיים מציגות הסבר.' },
        { q: 'the students___ essays', tag: 'שייכות ברבים', a: ["'", "'s", 's', "s's"], e: "רבים על s: the students' essays." },
        { q: 'The novel ___ published in 1922 ___ changed the form.', tag: 'תוספת', a: [', ... ,', '; ... ;', ': ... :', '– ... ,'], e: 'פסיקים סביב תוספת: The novel, published in 1922, changed the form.' },
      ],
    },
    {
      name: 'ריכוך (hedging) ומשלב',
      qs: [
        { he: true, q: 'איזה פועל הכי זהיר?', a: ['suggests', 'shows', 'proves', 'establishes'], e: 'suggests זהיר. shows חזק. proves כמעט רק כשיש הוכחה.' },
        { q: 'The narrator ___ unreliable.', tag: 'בזהירות', a: ['seems', 'is obviously', 'is certainly', 'must be'], e: 'seems / appears – ריכוך.' },
        { q: 'Critics ___ read the scene as ironic.', a: ['tend to', 'always', 'never', 'must'], e: 'tend to = נוטים.' },
        { he: true, q: 'מה מתאים לכתיבה אקדמית?', a: ['It is clear that', "It's clear that", 'Gonna be clear', 'I think it is like clear'], e: 'בלי קיצורים ובלי דיבור במאמר רשמי.' },
        { he: true, q: 'מה עדיף במאמר במקום <span class="en">a lot of</span>?', a: ['a great deal of', 'lots of', 'tons of', 'loads of'], e: 'much / many / a great deal of.' },
        { he: true, q: 'מה עדיף במאמר במקום <span class="en">get</span>?', a: ['obtain', 'grab', 'snatch', 'got'], e: 'obtain / receive / become – לפי ההקשר.' },
        { q: 'The poet rejects the city. This ___ shapes the last stanza.', a: ['rejection', 'reject', 'rejecting it', 'rejected'], e: 'nominalisation – פעולה הופכת לשם כדי לחבר רעיונות.' },
        { q: 'It is clear that the ending fails.', tag: 'מה המבנה?', a: ['extraposition', 'inversion', 'cleft', 'fronting'], e: 'extraposition – דוחים פסוקית כבדה לסוף ושמים it בהתחלה.' },
      ],
    },
    {
      name: 'קריאה צמודה: היפוך והדגשה',
      qs: [
        { q: '___ the narrator explain the motive.', a: ['Rarely does', 'Rarely', 'Rarely do', 'Does rarely'], e: 'היפוך אחרי מילה מגבילה: Rarely does...' },
        { q: '___ she left earlier, she would have lived.', a: ['Had', 'If had', 'Has', 'Would'], e: 'Had she left = If she had left.' },
        { q: '___ it not for the letter, the plot would collapse.', a: ['Were', 'Was', 'If', 'Had'], e: 'Were it not for = If it were not for.' },
        { q: 'It is the silence that frightens the reader.', tag: 'מה המבנה?', a: ['it-cleft', 'wh-cleft', 'existential there', 'passive'], e: 'It is ... that = it-cleft.' },
        { q: 'What frightens the reader is the silence.', tag: 'מה המבנה?', a: ['wh-cleft', 'it-cleft', 'extraposition', 'inversion'], e: 'What ... is = wh-cleft (pseudo-cleft).' },
        { q: 'The text ___ resist a simple reading.', tag: 'הדגשה', a: ['does', 'is', 'has', 'do'], e: 'emphatic do.' },
        { q: 'the issues discussed above', tag: 'מה זה?', a: ['reduced relative clause', 'dangling participle', 'absolute', 'cleft'], e: '= the issues which are discussed above.' },
        { q: 'The war over, the city was quiet.', tag: 'מה זה?', a: ['absolute construction', 'dangling participle', 'comma splice', 'cleft'], e: 'יש לו נושא משלו, שאינו הנושא של המשפט.' },
        { q: 'When she arrived, Dana sat down.', tag: 'she מצביע קדימה. זה:', a: ['cataphora', 'anaphora', 'deixis', 'ellipsis'], e: 'cataphora – הפניה קדימה.' },
      ],
    },
  ];

  ChapterQuiz.register({
    id: 'ba_grammar',
    cat: 'ba',
    icon: '🏛️',
    title: 'דקדוק אקדמי',
    desc: 'שמות חלקי הדקדוק, פיסוק, ריכוך, היפוך – ברמת תואר.',
    long: 'בתואר צריך גם לכתוב נכון וגם <b>לקרוא לדברים בשם</b>. השאלות כאן בנויות מקובץ הדקדוק של התואר.',
    chapters: CHAPTERS,
  });
})();
