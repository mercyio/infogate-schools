/**
 * Seed script:
 * 1. Upsert subjects per level
 * 2. Assign subjects to every class (ClassSubject entries)
 * 3. Seed Mon–Fri timetable slots per level (Assembly, subjects, Lunch Break)
 *
 * Run: npx ts-node src/scripts/seedTimetable.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Subject from '../models/Subject';
import ClassSubject from '../models/ClassSubject';
import Timetable from '../models/Timetable';
import Class from '../models/Class';

const MONGO_URI = process.env.MONGO_URI!;

// ── Subjects per level ────────────────────────────────────────────────────────

const SUBJECTS: Record<string, { name: string; code: string }[]> = {
  nursery: [
    { name: 'Assembly',       code: 'NUR-ASSEMBLY' },
    { name: 'Phonics',        code: 'NUR-PHO' },
    { name: 'Numeracy',       code: 'NUR-NUM' },
    { name: 'Story Time',     code: 'NUR-STR' },
    { name: 'Arts & Crafts',  code: 'NUR-ART' },
    { name: 'Music & Rhymes', code: 'NUR-MUS' },
    { name: 'Lunch Break',    code: 'NUR-LUNCH' },
    { name: 'Free Play',      code: 'NUR-PLAY' },
    { name: 'Social Studies', code: 'NUR-SOC' },
  ],
  primary: [
    { name: 'Assembly',           code: 'PRI-ASSEMBLY' },
    { name: 'English Language',   code: 'PRI-ENG' },
    { name: 'Mathematics',        code: 'PRI-MAT' },
    { name: 'Basic Science',      code: 'PRI-SCI' },
    { name: 'Social Studies',     code: 'PRI-SOC' },
    { name: 'Civic Education',    code: 'PRI-CIV' },
    { name: 'Creative Arts',      code: 'PRI-ART' },
    { name: 'Physical Education', code: 'PRI-PE' },
    { name: 'Religious Studies',  code: 'PRI-REL' },
    { name: 'Lunch Break',        code: 'PRI-LUNCH' },
  ],
  secondary: [
    { name: 'Assembly',           code: 'SEC-ASSEMBLY' },
    { name: 'English Language',   code: 'SEC-ENG' },
    { name: 'Mathematics',        code: 'SEC-MAT' },
    { name: 'Physics',            code: 'SEC-PHY' },
    { name: 'Chemistry',          code: 'SEC-CHE' },
    { name: 'Biology',            code: 'SEC-BIO' },
    { name: 'Economics',          code: 'SEC-ECO' },
    { name: 'Geography',          code: 'SEC-GEO' },
    { name: 'History',            code: 'SEC-HIS' },
    { name: 'Civic Education',    code: 'SEC-CIV' },
    { name: 'Physical Education', code: 'SEC-PE' },
    { name: 'Computer Science',   code: 'SEC-COM' },
    { name: 'Lunch Break',        code: 'SEC-LUNCH' },
  ],
  vocational: [
    { name: 'Assembly',                code: 'VOC-ASSEMBLY' },
    { name: 'English Language',        code: 'VOC-ENG' },
    { name: 'Mathematics',             code: 'VOC-MAT' },
    { name: 'Technical Drawing',       code: 'VOC-TDR' },
    { name: 'Electrical Installation', code: 'VOC-ELE' },
    { name: 'Carpentry & Joinery',     code: 'VOC-CAR' },
    { name: 'Auto Mechanics',          code: 'VOC-AUT' },
    { name: 'ICT',                     code: 'VOC-ICT' },
    { name: 'Entrepreneurship',        code: 'VOC-ENT' },
    { name: 'Lunch Break',             code: 'VOC-LUNCH' },
  ],
};

// creche classes share nursery subjects
const LEVEL_MAP: Record<string, string> = { creche: 'nursery' };
const effectiveLevel = (l: string) => LEVEL_MAP[l] ?? l;

// ── Daily slot templates ──────────────────────────────────────────────────────

type Slot = { code: string; start: string; end: string };

const TIMETABLES: Record<string, Slot[][]> = {
  // index 0 = Monday (day 1) … index 4 = Friday (day 5)
  nursery: [
    // Mon
    [
      { code: 'NUR-ASSEMBLY', start: '08:00', end: '08:30' },
      { code: 'NUR-PHO',      start: '08:30', end: '09:10' },
      { code: 'NUR-NUM',      start: '09:10', end: '09:50' },
      { code: 'NUR-ART',      start: '10:00', end: '10:40' },
      { code: 'NUR-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'NUR-PLAY',     start: '13:00', end: '13:40' },
      { code: 'NUR-SOC',      start: '13:40', end: '14:20' },
    ],
    // Tue
    [
      { code: 'NUR-ASSEMBLY', start: '08:00', end: '08:30' },
      { code: 'NUR-MUS',      start: '08:30', end: '09:10' },
      { code: 'NUR-PHO',      start: '09:10', end: '09:50' },
      { code: 'NUR-STR',      start: '10:00', end: '10:40' },
      { code: 'NUR-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'NUR-PLAY',     start: '13:00', end: '13:40' },
      { code: 'NUR-ART',      start: '13:40', end: '14:20' },
    ],
    // Wed
    [
      { code: 'NUR-ASSEMBLY', start: '08:00', end: '08:30' },
      { code: 'NUR-NUM',      start: '08:30', end: '09:10' },
      { code: 'NUR-STR',      start: '09:10', end: '09:50' },
      { code: 'NUR-MUS',      start: '10:00', end: '10:40' },
      { code: 'NUR-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'NUR-SOC',      start: '13:00', end: '13:40' },
      { code: 'NUR-PLAY',     start: '13:40', end: '14:20' },
    ],
    // Thu
    [
      { code: 'NUR-ASSEMBLY', start: '08:00', end: '08:30' },
      { code: 'NUR-PHO',      start: '08:30', end: '09:10' },
      { code: 'NUR-ART',      start: '09:10', end: '09:50' },
      { code: 'NUR-SOC',      start: '10:00', end: '10:40' },
      { code: 'NUR-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'NUR-MUS',      start: '13:00', end: '13:40' },
      { code: 'NUR-PLAY',     start: '13:40', end: '14:20' },
    ],
    // Fri
    [
      { code: 'NUR-ASSEMBLY', start: '08:00', end: '08:30' },
      { code: 'NUR-STR',      start: '08:30', end: '09:10' },
      { code: 'NUR-NUM',      start: '09:10', end: '09:50' },
      { code: 'NUR-ART',      start: '10:00', end: '10:40' },
      { code: 'NUR-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'NUR-PLAY',     start: '13:00', end: '13:40' },
      { code: 'NUR-SOC',      start: '13:40', end: '14:20' },
    ],
  ],

  primary: [
    // Mon
    [
      { code: 'PRI-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'PRI-ENG',      start: '08:30', end: '09:20' },
      { code: 'PRI-MAT',      start: '09:20', end: '10:10' },
      { code: 'PRI-SCI',      start: '10:20', end: '11:10' },
      { code: 'PRI-CIV',      start: '11:10', end: '12:00' },
      { code: 'PRI-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'PRI-ART',      start: '13:00', end: '13:50' },
      { code: 'PRI-PE',       start: '13:50', end: '14:40' },
    ],
    // Tue
    [
      { code: 'PRI-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'PRI-MAT',      start: '08:30', end: '09:20' },
      { code: 'PRI-ENG',      start: '09:20', end: '10:10' },
      { code: 'PRI-REL',      start: '10:20', end: '11:10' },
      { code: 'PRI-SOC',      start: '11:10', end: '12:00' },
      { code: 'PRI-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'PRI-SCI',      start: '13:00', end: '13:50' },
      { code: 'PRI-ART',      start: '13:50', end: '14:40' },
    ],
    // Wed
    [
      { code: 'PRI-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'PRI-SCI',      start: '08:30', end: '09:20' },
      { code: 'PRI-MAT',      start: '09:20', end: '10:10' },
      { code: 'PRI-ENG',      start: '10:20', end: '11:10' },
      { code: 'PRI-CIV',      start: '11:10', end: '12:00' },
      { code: 'PRI-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'PRI-PE',       start: '13:00', end: '13:50' },
      { code: 'PRI-SOC',      start: '13:50', end: '14:40' },
    ],
    // Thu
    [
      { code: 'PRI-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'PRI-ENG',      start: '08:30', end: '09:20' },
      { code: 'PRI-SOC',      start: '09:20', end: '10:10' },
      { code: 'PRI-MAT',      start: '10:20', end: '11:10' },
      { code: 'PRI-REL',      start: '11:10', end: '12:00' },
      { code: 'PRI-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'PRI-SCI',      start: '13:00', end: '13:50' },
      { code: 'PRI-ART',      start: '13:50', end: '14:40' },
    ],
    // Fri
    [
      { code: 'PRI-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'PRI-MAT',      start: '08:30', end: '09:20' },
      { code: 'PRI-ENG',      start: '09:20', end: '10:10' },
      { code: 'PRI-PE',       start: '10:20', end: '11:10' },
      { code: 'PRI-CIV',      start: '11:10', end: '12:00' },
      { code: 'PRI-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'PRI-SOC',      start: '13:00', end: '13:50' },
      { code: 'PRI-REL',      start: '13:50', end: '14:40' },
    ],
  ],

  secondary: [
    // Mon
    [
      { code: 'SEC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'SEC-ENG',      start: '08:30', end: '09:20' },
      { code: 'SEC-MAT',      start: '09:20', end: '10:10' },
      { code: 'SEC-PHY',      start: '10:20', end: '11:10' },
      { code: 'SEC-CHE',      start: '11:10', end: '12:00' },
      { code: 'SEC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'SEC-BIO',      start: '13:00', end: '13:50' },
      { code: 'SEC-ECO',      start: '13:50', end: '14:40' },
    ],
    // Tue
    [
      { code: 'SEC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'SEC-MAT',      start: '08:30', end: '09:20' },
      { code: 'SEC-ENG',      start: '09:20', end: '10:10' },
      { code: 'SEC-GEO',      start: '10:20', end: '11:10' },
      { code: 'SEC-HIS',      start: '11:10', end: '12:00' },
      { code: 'SEC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'SEC-COM',      start: '13:00', end: '13:50' },
      { code: 'SEC-CIV',      start: '13:50', end: '14:40' },
    ],
    // Wed
    [
      { code: 'SEC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'SEC-PHY',      start: '08:30', end: '09:20' },
      { code: 'SEC-CHE',      start: '09:20', end: '10:10' },
      { code: 'SEC-MAT',      start: '10:20', end: '11:10' },
      { code: 'SEC-ENG',      start: '11:10', end: '12:00' },
      { code: 'SEC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'SEC-PE',       start: '13:00', end: '13:50' },
      { code: 'SEC-ECO',      start: '13:50', end: '14:40' },
    ],
    // Thu
    [
      { code: 'SEC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'SEC-BIO',      start: '08:30', end: '09:20' },
      { code: 'SEC-ENG',      start: '09:20', end: '10:10' },
      { code: 'SEC-ECO',      start: '10:20', end: '11:10' },
      { code: 'SEC-MAT',      start: '11:10', end: '12:00' },
      { code: 'SEC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'SEC-HIS',      start: '13:00', end: '13:50' },
      { code: 'SEC-GEO',      start: '13:50', end: '14:40' },
    ],
    // Fri
    [
      { code: 'SEC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'SEC-COM',      start: '08:30', end: '09:20' },
      { code: 'SEC-MAT',      start: '09:20', end: '10:10' },
      { code: 'SEC-ENG',      start: '10:20', end: '11:10' },
      { code: 'SEC-CIV',      start: '11:10', end: '12:00' },
      { code: 'SEC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'SEC-PHY',      start: '13:00', end: '13:50' },
      { code: 'SEC-PE',       start: '13:50', end: '14:40' },
    ],
  ],

  vocational: [
    // Mon
    [
      { code: 'VOC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'VOC-ENG',      start: '08:30', end: '09:20' },
      { code: 'VOC-MAT',      start: '09:20', end: '10:10' },
      { code: 'VOC-ELE',      start: '10:20', end: '11:10' },
      { code: 'VOC-TDR',      start: '11:10', end: '12:00' },
      { code: 'VOC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'VOC-ICT',      start: '13:00', end: '13:50' },
      { code: 'VOC-ENT',      start: '13:50', end: '14:40' },
    ],
    // Tue
    [
      { code: 'VOC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'VOC-MAT',      start: '08:30', end: '09:20' },
      { code: 'VOC-ENG',      start: '09:20', end: '10:10' },
      { code: 'VOC-CAR',      start: '10:20', end: '11:10' },
      { code: 'VOC-AUT',      start: '11:10', end: '12:00' },
      { code: 'VOC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'VOC-TDR',      start: '13:00', end: '13:50' },
      { code: 'VOC-ICT',      start: '13:50', end: '14:40' },
    ],
    // Wed
    [
      { code: 'VOC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'VOC-ELE',      start: '08:30', end: '09:20' },
      { code: 'VOC-MAT',      start: '09:20', end: '10:10' },
      { code: 'VOC-ENG',      start: '10:20', end: '11:10' },
      { code: 'VOC-ENT',      start: '11:10', end: '12:00' },
      { code: 'VOC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'VOC-CAR',      start: '13:00', end: '13:50' },
      { code: 'VOC-AUT',      start: '13:50', end: '14:40' },
    ],
    // Thu
    [
      { code: 'VOC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'VOC-ICT',      start: '08:30', end: '09:20' },
      { code: 'VOC-ENG',      start: '09:20', end: '10:10' },
      { code: 'VOC-MAT',      start: '10:20', end: '11:10' },
      { code: 'VOC-TDR',      start: '11:10', end: '12:00' },
      { code: 'VOC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'VOC-ENT',      start: '13:00', end: '13:50' },
      { code: 'VOC-ELE',      start: '13:50', end: '14:40' },
    ],
    // Fri
    [
      { code: 'VOC-ASSEMBLY', start: '07:45', end: '08:30' },
      { code: 'VOC-AUT',      start: '08:30', end: '09:20' },
      { code: 'VOC-CAR',      start: '09:20', end: '10:10' },
      { code: 'VOC-ENG',      start: '10:20', end: '11:10' },
      { code: 'VOC-MAT',      start: '11:10', end: '12:00' },
      { code: 'VOC-LUNCH',    start: '12:00', end: '13:00' },
      { code: 'VOC-ICT',      start: '13:00', end: '13:50' },
      { code: 'VOC-ENT',      start: '13:50', end: '14:40' },
    ],
  ],
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // 1. Upsert subjects for all levels
  const subjectMap: Record<string, mongoose.Types.ObjectId> = {};

  for (const [level, subjects] of Object.entries(SUBJECTS)) {
    for (const s of subjects) {
      const doc = await Subject.findOneAndUpdate(
        { code: s.code },
        { code: s.code, name: s.name, level },
        { upsert: true, new: true }
      );
      subjectMap[s.code] = doc._id as mongoose.Types.ObjectId;
    }
  }
  console.log(`✅ Subjects upserted: ${Object.keys(subjectMap).length}`);

  // 2. Assign subjects to every class via ClassSubject
  const classes = await Class.find({}).lean();
  console.log(`📚 Found ${classes.length} classes`);

  let csCreated = 0;
  let csSkipped = 0;

  for (const cls of classes) {
    const lvl = effectiveLevel(cls.level); // map creche → nursery
    const subjects = SUBJECTS[lvl];
    if (!subjects) {
      console.log(`  ⚠️  No subjects defined for level "${cls.level}" (${cls.name}) — skipping`);
      continue;
    }

    for (const s of subjects) {
      const subjectId = subjectMap[s.code];
      const exists = await ClassSubject.findOne({ class_id: cls._id, subject_id: subjectId });
      if (!exists) {
        await ClassSubject.create({ class_id: cls._id, subject_id: subjectId });
        csCreated++;
      } else {
        csSkipped++;
      }
    }
    console.log(`  ✔  ${cls.name} (${cls.level}) — subjects assigned`);
  }
  console.log(`✅ ClassSubject: ${csCreated} created, ${csSkipped} already existed`);

  // 3. Clear and re-seed timetables
  await Timetable.deleteMany({});
  console.log('🗑  Cleared existing timetables');

  const ttDocs: any[] = [];

  for (const [level, days] of Object.entries(TIMETABLES)) {
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
      const dayOfWeek = dayIdx + 1; // 1=Mon … 5=Fri
      for (const slot of days[dayIdx]) {
        const subjectId = subjectMap[slot.code];
        if (!subjectId) { console.warn(`  ⚠️  Unknown code ${slot.code}`); continue; }
        ttDocs.push({
          level,
          subject_id: subjectId,
          day_of_week: dayOfWeek,
          start_time: slot.start,
          end_time: slot.end,
        });
      }
    }
  }

  await Timetable.insertMany(ttDocs);
  console.log(`✅ Timetable: ${ttDocs.length} slots inserted across ${Object.keys(TIMETABLES).length} levels × 5 days`);

  await mongoose.disconnect();
  console.log('👋 Done');
}

main().catch(err => { console.error(err); process.exit(1); });
