import fs from 'fs';
import path from 'path';
import { db, VocabEntity, SentenceEntity } from '../db/store.js';

function seedData() {
  console.log('🌱 Starting database seed script...');

  const dataDir = path.join(process.cwd(), '..', 'src', 'data');

  // 1. Vocabulary.json (Section 1)
  const vocabPath = path.join(dataDir, 'vocabulary.json');
  const adjPath = path.join(dataDir, 'adjectives_section.json');
  const phoneticsPath = path.join(dataDir, 'phonetics_section.json');
  const relativesPath = path.join(dataDir, 'relatives_section.json');
  const profPath = path.join(dataDir, 'professionals_section.json');
  const verbsPath = path.join(dataDir, 'verbs_section.json');
  const animalsPath = path.join(dataDir, 'animals_and_birds_section.json');
  const disastersPath = path.join(dataDir, 'disasters_and_epidemics_section.json');
  const sentencesPath = path.join(dataDir, 'sentences.json');

  const allVocab: VocabEntity[] = [];

  if (fs.existsSync(vocabPath)) {
    const raw = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
    (raw as any[]).forEach((item) => {
      allVocab.push({
        id: String(item.id),
        gujarati: item.gujarati,
        english: item.english,
        pronunciation_gujarati: item.english_pronunciation || item.phonetic || item.gujarati,
        phonetic: item.phonetic,
        english_pronunciation: item.english_pronunciation,
        category: item.category || 'General',
        difficulty: item.difficulty || 'Easy',
        example: item.example,
        sectionId: 'section1',
        sectionName: 'Section 1: General Vocabulary & Core Words',
      });
    });
  }

  if (fs.existsSync(adjPath)) {
    const raw = JSON.parse(fs.readFileSync(adjPath, 'utf-8'));
    const items = raw.adjectives_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `adj-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: 'Adjectives',
        difficulty: 'Easy',
        sectionId: 'section2',
        sectionName: 'Section 2: Descriptive Adjectives',
      });
    });
  }

  if (fs.existsSync(phoneticsPath)) {
    const raw = JSON.parse(fs.readFileSync(phoneticsPath, 'utf-8'));
    const items = raw.phonetics_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `phonetic-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: item.category || 'Phonetics',
        difficulty: 'Easy',
        sectionId: 'section3',
        sectionName: 'Section 3: Phonetics & Sound Rules',
      });
    });
  }

  if (fs.existsSync(relativesPath)) {
    const raw = JSON.parse(fs.readFileSync(relativesPath, 'utf-8'));
    const items = raw.relatives_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `relative-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: item.category || '1. Relatives – સગાસંબંધીઓ',
        difficulty: 'Easy',
        sectionId: 'section4',
        sectionName: 'Section 4: 1. Relatives – સગાસંબંધીઓ',
      });
    });
  }

  if (fs.existsSync(profPath)) {
    const raw = JSON.parse(fs.readFileSync(profPath, 'utf-8'));
    const items = raw.professionals_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `prof-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: item.category || '2. Professionals – ધંધાદારીઓ',
        difficulty: 'Easy',
        sectionId: 'section5',
        sectionName: 'Section 5: 2. Professionals – ધંધાદારીઓ',
      });
    });
  }

  if (fs.existsSync(verbsPath)) {
    const raw = JSON.parse(fs.readFileSync(verbsPath, 'utf-8'));
    const items = raw.verbs_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `verb-${item.id || index + 1}`,
        gujarati: item.gujarati,
        english: item.v1_base_form,
        pronunciation_gujarati: item.v1_pronunciation_gujarati,
        phonetic: `V1: ${item.v1_base_form} (${item.v1_pronunciation_gujarati}) | V2: ${item.v2_past_simple} (${item.v2_pronunciation_gujarati}) | V3: ${item.v3_past_participle} (${item.v3_pronunciation_gujarati})`,
        english_pronunciation: item.v1_base_form,
        category: '3. Verbs – ક્રિયાપદો (V1, V2, V3)',
        difficulty: 'Easy',
        example: `V1: ${item.v1_base_form} (${item.v1_pronunciation_gujarati}) | V2: ${item.v2_past_simple} (${item.v2_pronunciation_gujarati}) | V3: ${item.v3_past_participle} (${item.v3_pronunciation_gujarati})`,
        sectionId: 'section6',
        sectionName: 'Section 6: 3. Verbs – ક્રિયાપદો (V1, V2, V3)',
        v1_base_form: item.v1_base_form,
        v1_pronunciation_gujarati: item.v1_pronunciation_gujarati,
        v2_past_simple: item.v2_past_simple,
        v2_pronunciation_gujarati: item.v2_pronunciation_gujarati,
        v3_past_participle: item.v3_past_participle,
        v3_pronunciation_gujarati: item.v3_pronunciation_gujarati,
      } as any);
    });
  }

  if (fs.existsSync(animalsPath)) {
    const raw = JSON.parse(fs.readFileSync(animalsPath, 'utf-8'));
    const items = raw.animals_and_birds_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `animal-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: item.category || '4. Animals & Birds – પ્રાણીઓ અને પક્ષીઓ',
        difficulty: 'Easy',
        sectionId: 'section7',
        sectionName: 'Section 7: 4. Animals & Birds – પ્રાણીઓ અને પક્ષીઓ',
      });
    });
  }

  if (fs.existsSync(disastersPath)) {
    const raw = JSON.parse(fs.readFileSync(disastersPath, 'utf-8'));
    const items = raw.disasters_and_epidemics_section || [];
    items.forEach((item: any, index: number) => {
      allVocab.push({
        id: `disaster-${index + 1}`,
        gujarati: item.meaning_gujarati || item.english,
        english: item.english,
        pronunciation_gujarati: item.pronunciation_gujarati,
        phonetic: item.pronunciation_gujarati,
        english_pronunciation: item.english,
        category: item.category || '5. Disasters & Epidemics – આપત્તિઓ અને રોગચાળો',
        difficulty: 'Easy',
        sectionId: 'section8',
        sectionName: 'Section 8: 5. Disasters & Epidemics – આપત્તિઓ અને રોગચાળો',
      });
    });
  }

  db.setVocabulary(allVocab);
  console.log(`✅ Seeded ${allVocab.length} vocabulary items across 8 sections.`);

  // Sentences Seeding (handles object with _order or array format)
  const allSentences: SentenceEntity[] = [];
  if (fs.existsSync(sentencesPath)) {
    const raw = JSON.parse(fs.readFileSync(sentencesPath, 'utf-8'));
    if (Array.isArray(raw)) {
      raw.forEach((s: any, idx: number) => {
        allSentences.push({
          id: s.id || `sent-${idx + 1}`,
          english: s.english || s.text,
          gujarati: s.gujarati || s.meaning,
          answers: s.answers || [],
          topic: s.topic || 'General',
          sectionKey: s.sectionKey || 'general',
          difficulty: s.difficulty || 'Easy',
          hint: s.hint,
        });
      });
    } else if (typeof raw === 'object' && raw !== null) {
      const keys = Object.keys(raw).filter((k) => k !== '_order');
      keys.forEach((sectionKey) => {
        const items = raw[sectionKey];
        if (Array.isArray(items)) {
          items.forEach((s: any) => {
            allSentences.push({
              id: s.id,
              gujarati: s.gujarati,
              english: s.english,
              answers: s.answers || [],
              topic: s.topic || sectionKey.replace('_section', ''),
              sectionKey,
              difficulty: s.difficulty || 'Easy',
              hint: s.hint,
            });
          });
        }
      });
    }
  }

  db.setSentences(allSentences);
  console.log(`✅ Seeded ${allSentences.length} sentence items across all question categories.`);

  console.log('🚀 Database seeding complete!');
}

seedData();
