import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.cv.json');
const dstDocs = resolve(dir, 'docs', 'resume.cv.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const cv = {
  $schema: 'https://freecv.org/schema/cv/v1.json',

  basics: {
    name: b.name,
    label: b.label,
    image: b.image,
    email: b.email,
    phone: b.phone,
    url: b.url,
    summary: b.summary,
    location: b.location ? [b.location.city, b.location.countryCode].filter(Boolean).join(', ') : undefined,
    profiles: b.profiles
  },

  work: (resume.work || []).map(w => ({
    company: w.name || w.position || 'Unknown',
    position: w.position,
    startDate: w.startDate,
    endDate: w.endDate || undefined,
    current: !w.endDate,
    summary: w.summary,
    highlights: w.highlights
  })),

  education: (resume.education || []).map(e => ({
    institution: e.institution,
    degree: e.studyType || e.area || 'Unknown',
    field: e.area,
    startDate: e.startDate,
    endDate: e.endDate,
    score: e.score,
    summary: e.summary,
    highlights: e.highlights
  })),

  skills: collectSkills(resume.skills),

  languages: resume.languages,

  projects: (resume.projects || []).map(p => ({
    name: p.name,
    description: p.description,
    url: p.url,
    highlights: p.highlights,
    keywords: p.keywords
  })),

  interests: (resume.interests || []).map(i => i.name).filter(Boolean),

  certificates: resume.certificates,

  publications: resume.publications,

  awards: resume.awards,

  volunteer: (resume.volunteer || []).map(v => ({
    organization: v.organization,
    position: v.position,
    startDate: v.startDate,
    endDate: v.endDate,
    summary: v.summary,
    highlights: v.highlights
  })),

  references: (resume.references || []).map(r => ({
    name: r.name,
    reference: r.reference
  })),

  referencesMode: 'on-request',

  availability: b.availability ? {
    status: b.availability.status,
    workType: (b.availability.workType || []).filter(t => t !== 'freelance'),
    roles: b.availability.roles
  } : undefined,

  ats: {
    keywords: collectSkills(resume.skills),
    yearsOfExperience: computeYears(resume.work),
    seniority: 'senior'
  },

  verification: {
    email: Boolean(b.email),
    platform: 'giacomo.tuefekci.de'
  },

  meta: {
    version: '1.2',
    canonical: 'https://giacomo.tuefekci.de/resume.cv.json',
    lastModified: new Date().toISOString().slice(0, 10),
    generator: 'giacomo.tuefekci/export-freecv'
  }
};

clean(cv);

writeFileSync(dst, JSON.stringify(cv, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.cv.json — FreeCV / cv.json format');

function collectSkills(skills) {
  if (!skills) return [];
  const set = new Set();
  for (const s of skills) {
    if (s.name) set.add(s.name);
    for (const k of (s.keywords || [])) {
      set.add(k);
    }
  }
  return [...set].sort();
}

function computeYears(work) {
  if (!work || work.length === 0) return 0;
  const dates = work
    .map(w => w.startDate)
    .filter(Boolean)
    .sort();
  if (dates.length === 0) return 0;
  const first = new Date(dates[0]);
  const now = new Date();
  return Math.max(1, now.getFullYear() - first.getFullYear());
}

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
