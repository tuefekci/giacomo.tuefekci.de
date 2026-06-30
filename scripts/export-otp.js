import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.otp.json');
const dstDocs = resolve(dir, 'docs', 'resume.otp.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const SKILL_LIFT = {
  'Master': 5,
  'Advanced': 5,
  'Skilled': 4,
  'Proficient': 4,
  'Intermediate': 3,
};

const now = new Date().toISOString();

function toDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
}
const nameParts = (b.name || '').split(' ');
const given = nameParts[0] || '';
const family = nameParts.slice(1).join(' ') || '';

const workModel = (b.availability?.workType || []).filter(w => w !== 'freelance');

const availabilityMap = { 'open': 'immediate' };
const availability = availabilityMap[b.availability?.status] || b.availability?.status;

const langMap = {
  'German': { language: 'de', proficiency: 'native' },
  'English': { language: 'en', proficiency: 'C2' },
};

function buildSkills(skills) {
  if (!skills) return [];
  const map = new Map();
  for (const s of skills) {
    const level = SKILL_LIFT[s.level];
    if (!level) continue;
    for (const kw of (s.keywords || [])) {
      const existing = map.get(kw);
      if (!existing || level > existing.level) {
        map.set(kw, { name: kw, level });
      }
    }
  }
  return [...map.values()];
}

const otp = {
  schema_version: '0.2.0',
  otp_id: crypto.randomUUID(),
  created_at: now,
  updated_at: now,
  disclosure_tier: 'profile',
  name: {
    given,
    family,
    display: b.name,
  },
  title: b.label,
  location: b.location
    ? {
        country: b.location.countryCode,
        city: b.location.city,
        region: b.location.region,
      }
    : undefined,
  availability,
  work_model: workModel.length > 0 ? workModel : undefined,
  salary_band: b.salary_band,
  skills: buildSkills(resume.skills),
  experience: (resume.work || []).map(w => ({
    company: w.name || w.position || 'Unknown',
    title: w.position,
    start_date: toDate(w.startDate),
    end_date: toDate(w.endDate) || undefined,
    location: w.location,
    description: [w.summary, ...(w.highlights || [])].filter(Boolean).join('\n') || undefined,
  })),
  education: (resume.education || []).map(e => ({
    institution: e.institution || 'Unknown',
    degree: e.studyType || e.area || 'Unknown',
    field: e.area || '',
    status: e.endDate ? 'completed' : 'incomplete',
    graduation_date: e.endDate ? e.endDate.replace(/^(\d{4}).*$/, '$1-06') : undefined,
  })),
  languages: (resume.languages || []).map(l => langMap[l.language]).filter(Boolean),
  seniority: 'senior',
  industries: b.industries,
  notice_period: b.notice_period !== undefined ? { days: b.notice_period, negotiable: true } : undefined,
  source: {
    agent_id: 'giacomo.tuefekci/export-otp',
    consent_type: 'consent',
    consent_date: now.slice(0, 10),
  },
};

clean(otp);

writeFileSync(dst, JSON.stringify(otp, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.otp.json — Open Talent Protocol v0.2');

function clean(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].filter(v => v !== undefined && v !== null);
      if (obj[key].length === 0) delete obj[key];
    } else if (typeof obj[key] === 'object') {
      clean(obj[key]);
      if (Object.keys(obj[key]).length === 0) delete obj[key];
    }
  }
}
