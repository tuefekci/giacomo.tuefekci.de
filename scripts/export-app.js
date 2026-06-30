import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.app.json');
const dstDocs = resolve(dir, 'docs', 'resume.app.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const nameParts = (b.name || '').split(' ');
const given = nameParts[0] || '';
const family = nameParts.slice(1).join(' ') || '';

const now = new Date().toISOString();

function toYearMonth(dateStr) {
    if (!dateStr) return '';
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(dateStr)) return dateStr;
    const m = dateStr.match(/^(\d{4})-(0[1-9]|1[0-2])/);
    if (m) return m[1] + '-' + m[2];
    if (/^\d{4}$/.test(dateStr)) return dateStr + '-01';
    return '';
}

function toYear(dateStr) {
    if (!dateStr) return '';
    const m = dateStr.match(/^(\d{4})/);
    return m ? m[1] : '';
}

function mapLevel(level) {
    switch (level) {
        case 'Master': return 'Expert';
        case 'Advanced': return 'Advanced';
        case 'Skilled': return 'Advanced';
        case 'Proficient': return 'Intermediate';
        case 'Intermediate': return 'Intermediate';
        default: return 'Intermediate';
    }
}

function mapEmploymentType(position) {
    const p = (position || '').toLowerCase();
    if (p.includes('freelance')) return 'Contract';
    if (p.includes('parttime') || p.includes('part-time')) return 'Part-time';
    if (p.includes('apprenticeship')) return 'Internship';
    return 'Full-time';
}

function mapSkillCategory(skillName) {
    switch (skillName) {
        case 'Web Development': return 'Framework';
        case 'Software Development': return 'ProgrammingLanguage';
        case 'Design / Creative': return 'Domain';
        case 'SysAdmin / DevOps': return 'Tool';
        case 'Project Management': return 'Methodology';
        case 'Game Dev / Design': return 'Domain';
        case 'Other Skills': return 'SoftSkill';
        default: return 'Domain';
    }
}

const app = {
    protocol: {
        name: 'ApplicantProfileProtocol',
        shortName: 'APP',
        version: '1.0.0',
        uri: 'https://app-protocol.org/schema/app-1.0.json',
        id: 'urn:app-protocol:profile:tuefekci',
    },

    basics: {
        name: { given, family },
        headline: b.label || '',
        summary: b.summary || '',
        location: {
            country: b.location?.countryCode || '',
            region: b.location?.region || '',
            city: b.location?.city || '',
            remote: true,
        },
        contact: {
            email: b.email || '',
            phone: b.phone || '',
            website: b.url || '',
            social: (b.profiles || []).map(p => ({
                label: p.network || '',
                url: p.url || '',
            })),
        },
        links: [],
    },

    experience: (resume.work || []).map(w => ({
        role: w.position || '',
        organization: {
            name: w.name || w.position || 'Unknown',
        },
        start: toYearMonth(w.startDate),
        end: toYearMonth(w.endDate),
        current: !w.endDate,
        location: {
            country: 'DE',
            city: w.location || '',
        },
        employmentType: mapEmploymentType(w.position),
        highlights: w.highlights || [],
        technologies: [],
        links: [],
    })),

    education: (resume.education || []).map(e => ({
        institution: e.institution || '',
        area: e.area || '',
        degree: e.studyType || '',
        start: toYear(e.startDate),
        end: toYear(e.endDate),
        completed: !!e.endDate,
        grade: e.score || '',
        links: [],
    })),

    skills: (resume.skills || []).map(s => ({
        name: s.name || '',
        category: mapSkillCategory(s.name),
        level: mapLevel(s.level),
        aliases: s.keywords || [],
    })),

    projects: (resume.projects || [])
        .filter(p => p.visibility !== 'hidden' && p.visibility !== 'on-request')
        .map(p => ({
            name: p.name || '',
            description: p.description || '',
            role: 'Developer',
            stack: (p.highlights || [])
                .filter(h => h.startsWith('Technology:'))
                .map(h => h.replace(/^Technology:\s*/i, '')),
            links: p.url
                ? (p.url.includes('github.com')
                    ? { repository: p.url }
                    : { website: p.url })
                : undefined,
            highlights: (p.highlights || [])
                .filter(h => !h.startsWith('Technology:')),
        })),

    credentials: (resume.certificates || []).map(c => ({
        name: c.name || '',
        issuer: c.issuer || '',
        date: toYearMonth(c.date),
        url: c.url || '',
    })),

    languages: (resume.languages || []).map(l => ({
        name: l.language || '',
        proficiency: l.fluency || '',
    })),

    preferences: {
        employmentType: ['Full-time', 'Contract'],
        workMode: (b.availability?.workType || [])
            .filter(t => t !== 'freelance')
            .map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        relocation: false,
        preferredLocations: [],
    },

    metadata: {
        created: now,
        updated: now,
        source: 'Generated',
        tags: [],
    },
};

clean(app);

writeFileSync(dst, JSON.stringify(app, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.app.json — Applicant Profile Protocol v1.0');

function clean(obj) {
    for (const key of Object.keys(obj)) {
        if (obj[key] === undefined || obj[key] === null || obj[key] === '' || (Array.isArray(obj[key]) && obj[key].length === 0)) {
            delete obj[key];
        } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
            for (const item of obj[key]) {
                if (typeof item === 'object' && item !== null) clean(item);
            }
            obj[key] = obj[key].filter(v => v !== undefined && v !== null);
            if (obj[key].length === 0) delete obj[key];
        } else if (typeof obj[key] === 'object') {
            clean(obj[key]);
            if (Object.keys(obj[key]).length === 0) delete obj[key];
        }
    }
}
