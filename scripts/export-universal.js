import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.universal.json');
const dstDocs = resolve(dir, 'docs', 'resume.universal.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const nameParts = (b.name || '').split(' ');
const linkedinProfile = (b.profiles || []).find(p => p.network === 'LinkedIn');

const skillLevelMap = {
  Master: 'expert',
  Advanced: 'advanced',
  Skilled: 'advanced',
  Proficient: 'intermediate',
  Intermediate: 'intermediate',
};

const fluencyMap = {
  Native: 'bilingual',
  Professional: 'full-professional',
};

const initiativeTypeMap = {
  'open-source': 'open-source',
  'customer-work': 'startup',
  personal: 'personal',
  research: 'research',
};

const universal = {
  basics: {
    name: b.name || '',
    headline: b.label || '',
    picture: b.image || '',
    contact: {
      email: b.email || '',
      phone: b.phone || '',
      linkedin: linkedinProfile?.url || '',
    },
    location: b.location
      ? {
          address: b.location.address || '',
          city: b.location.city || '',
          countryCode: b.location.countryCode || '',
          postalCode: b.location.postalCode || '',
          region: b.location.region || '',
        }
      : undefined,
    website: b.url || '',
    summary: b.summary || '',
    profiles: (b.profiles || []).map(p => ({
      network: p.network === 'GitHub' ? 'Github' : p.network,
      url: p.url || '',
      username: p.username || '',
    })),
    nationalities: ['DE'],
    remote: true,
    availability: 'Immediate',
    birth: b.birth?.date || '',
  },

  employments: (resume.work || []).map(w => ({
    type: w.position?.toLowerCase().includes('freelance')
      ? 'freelance'
      : w.position?.toLowerCase().includes('apprenticeship')
        ? 'apprenticeship'
        : 'internal',
    organization: {
      name: w.name || w.position || 'Unknown',
    },
    position: w.position || '',
    startDate: w.startDate || '',
    endDate: w.endDate || '',
    summary: w.summary || '',
    highlights: w.highlights || [],
    url: w.url || '',
    location: w.location
      ? { city: w.location }
      : undefined,
  })),

  education: (resume.education || []).map(e => ({
    area: e.area || '',
    organization: {
      name: e.institution || '',
    },
    type: e.studyType || '',
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    score: e.score || undefined,
    courses: (e.courses || []).map(c => ({ name: c })),
    location: e.location
      ? {
          city: e.location,
        }
      : undefined,
  })),

  skills: (resume.skills || []).map(s => ({
    name: s.name || '',
    level: skillLevelMap[s.level] || undefined,
    tags: s.keywords || [],
  })),

  languages: (resume.languages || []).map(l => ({
    name: l.language || '',
    fluency: fluencyMap[l.fluency] || undefined,
  })),

  interests: (resume.interests || []).map(i => ({
    name: i.name || '',
    summary: i.summary || '',
    tags: i.keywords || [],
  })),

  initiatives: (resume.projects || [])
    .filter(p => p.visibility !== 'hidden')
    .map(p => ({
      name: p.name || '',
      summary: p.description || '',
      position: 'Developer',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      type: initiativeTypeMap[p.type] || 'personal',
      organization: p.entity ? { name: p.entity } : undefined,
      highlights: p.highlights || [],
      url: p.url || '',
      tags: p.keywords || [],
    })),

  meta: {
    schema: 'https://raw.githubusercontent.com/universal-resume/json-schema/main/schema.json',
    lastModified: new Date().toISOString().split('T')[0],
    canonical: b.url || '',
  },
};

clean(universal);

writeFileSync(dst, JSON.stringify(universal, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.universal.json — Universal Resume');

function clean(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key];
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].filter(v => v !== undefined && v !== null && v !== '');
      obj[key].forEach(v => typeof v === 'object' && clean(v));
      if (obj[key].length === 0) delete obj[key];
    } else if (typeof obj[key] === 'object') {
      clean(obj[key]);
      if (Object.keys(obj[key]).length === 0) delete obj[key];
    }
  }
}
