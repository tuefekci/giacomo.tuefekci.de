import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.barba-cv.json');
const dstDocs = resolve(dir, 'docs', 'resume.barba-cv.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const nameParts = (b.name || '').split(' ');
const firstName = nameParts[0] || '';
const lastName = nameParts.slice(1).join(' ') || '';

const githubProfile = (b.profiles || []).find(p => p.network === 'GitHub');

const now = new Date().toISOString();

const barba = {
  barba_cv_version: '1.2',

  personal_info: {
    first_name: firstName,
    middle_name: '',
    last_name: lastName,
    date_of_birth: b.birth?.date || '',
    driving_licenses: [],
    address: b.location
      ? {
          street: b.location.address || '',
          postal_code: b.location.postalCode || '',
          city: b.location.city || '',
          country: b.location.countryCode || '',
        }
      : { street: '', postal_code: '', city: '', country: '' },
    contact: {
      email: b.email || '',
      phone: b.phone || '',
    },
    links: {
      linkedin: '',
      github: githubProfile?.url || '',
      website: b.url || '',
      twitter: '',
      other_socials: [],
    },
  },

  profile_summary: b.summary || '',

  position_sought: b.availability?.roles || [b.label].filter(Boolean),

  experiences: (resume.work || []).map(w => ({
    organization: w.name || '',
    role_title: w.position || '',
    location: {
      city: w.location || '',
      country: 'DE',
    },
    start_date: w.startDate || '',
    end_date: w.endDate || '',
    website: w.url || '',
    logo: '',
    tasks: w.highlights || [],
    achievements: [],
  })),

  education: (resume.education || []).map(e => ({
    school: e.institution || '',
    degree: e.studyType || '',
    field: e.area || '',
    start_date: e.startDate || '',
    end_date: e.endDate || '',
    website: '',
    logo: '',
    school_location: {
      city: '',
      country: 'DE',
    },
  })),

  skills: buildSkills(resume.skills),

  certifications: (resume.certificates || []).map(c => ({
    name: c.name || '',
    issuer: c.issuer || '',
    date_obtained: c.date || '',
    expiry_date: '',
    credential_id: '',
    credential_url: c.url || '',
  })),

  languages: (resume.languages || []).map(l => ({
    language: l.language || '',
    level: l.fluency || '',
    certificates: [],
  })),

  interests: (resume.interests || []).map(i => i.name).filter(Boolean),

  project_achievements: (resume.projects || []).map(p => ({
    id: '',
    service_type: p.entity || p.category || '',
    client: '',
    title: p.name || '',
    period: [p.startDate, p.endDate].filter(Boolean).join(' - '),
    role: '',
    sectors: '',
    competencies: '',
    keywords: (p.keywords || []).join(', '),
    synonyms: '',
    description: p.description || (p.highlights || []).join('\n'),
  })),

  meta: {
    cv_uuid: crypto.randomUUID(),
    cv_title: `${b.name} - ${b.label}`,
    parsing_errors: [],
    ats_processed: true,
    processor_engine: 'giacomo.tuefekci/export-barbacv',
    parsed_at: now,
    source_original_text: null,
    source_ats_revised_text: null,
    original_filename: null,
    source_format: 'jsonresume',
    ingested_at: null,
    embedded_at: null,
    extraction_confidence_overall: null,
  },

  extensions: {},
};

clean(barba);

writeFileSync(dst, JSON.stringify(barba, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.barba-cv.json — Barba-CV v1.2');

function buildSkills(skills) {
  if (!skills) return { it_skills: [], hard_skills: [], soft_skills: [] };

  const itCategories = ['Web Development', 'Software Development', 'SysAdmin / DevOps', 'Game Dev / Design'];
  const hardCategories = ['Design / Creative', 'Other Skills'];
  const softCategories = ['Project Management'];

  const result = { it_skills: [], hard_skills: [], soft_skills: [] };

  for (const s of skills) {
    const entry = {
      name: s.name || '',
      level: s.level || '',
      category: '',
      keywords: s.keywords || [],
    };
    if (itCategories.includes(s.name)) {
      result.it_skills.push(entry);
    } else if (hardCategories.includes(s.name)) {
      result.hard_skills.push(entry);
    } else if (softCategories.includes(s.name)) {
      result.soft_skills.push(entry);
    }
  }

  return result;
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
