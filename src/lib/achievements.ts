/**
 * Student achievements data source.
 *
 * ---------------------------------------------------------------------------
 * DEMO / SAMPLE DATA
 * ---------------------------------------------------------------------------
 * The profiles currently shown on the site come from
 * `content/achievements-demo.json`. They are fictional examples created for
 * preview purposes and must NOT be presented as verified school achievements.
 *
 * Real student records live separately in `content/achievements.json` and are
 * never mixed with the demo file.
 *
 * To switch to real records later:
 *   1. Add `subjectsMY` and `subjectsEN` arrays to each entry in
 *      `content/achievements.json` (one entry per subject distinction).
 *   2. Set `USE_DEMO_DATA` to `false`.
 *   3. Remove the DEMO labels rendered where `IS_DEMO_DATA` is true.
 * ---------------------------------------------------------------------------
 */

import demoAchievementFile from '../../content/achievements-demo.json';
import verifiedAchievementFile from '../../content/achievements.json';

export type StudentAchievement = {
  id: string;
  nameMY: string;
  nameEN: string;
  year: string;
  distinctions: number;
  resultCategoryMY: string;
  resultCategoryEN: string;
  photo: string;
  subjectsMY: string[];
  subjectsEN: string[];
};

/** Flip to `false` once verified student records are ready. */
export const USE_DEMO_DATA = true;

export const IS_DEMO_DATA = USE_DEMO_DATA && demoAchievementFile.dataType === 'DEMO_SAMPLE_DATA';

export const DEMO_DATA_NOTICE = demoAchievementFile.notice;

const sourceStudents = USE_DEMO_DATA ? demoAchievementFile.students : verifiedAchievementFile;

export const achievementsData: StudentAchievement[] = sourceStudents.map((student) => {
  const record = student as Partial<StudentAchievement>;
  return {
    id: student.id,
    nameMY: student.nameMY,
    nameEN: student.nameEN,
    year: student.year,
    distinctions: student.distinctions,
    resultCategoryMY: student.resultCategoryMY,
    resultCategoryEN: student.resultCategoryEN,
    photo: student.photo,
    subjectsMY: record.subjectsMY ?? [],
    subjectsEN: record.subjectsEN ?? [],
  };
});
