import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.schema-resume.json');
const dstDocs = resolve(dir, 'docs', 'resume.schema-resume.json');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;

const profiles = (b.profiles || []).map(p => ({
    network: p.network,
    username: p.username || '',
    url: p.url || '',
}));

const schemaResume = {
    "@context": "https://schema-resume.org/schema.json",
    "$schema": "https://schema-resume.org/schema.json",
    basics: {
        name: b.name,
        label: b.label || '',
        email: b.email || '',
        phone: b.phone || '',
        url: b.url || '',
        summary: b.summary || '',
        image: b.image || '',
        location: {
            city: b.location?.city || '',
            countryCode: b.location?.countryCode || '',
            region: b.location?.region || '',
        },
        profiles,
        nationalities: b.birth?.countryCode
            ? [{ country: b.birth.countryCode, born: true }]
            : [],
    },
    work: (r.work || []).map(w => ({
        name: w.name || w.position || 'Unknown',
        position: w.position || '',
        url: w.url || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        summary: w.summary || '',
        highlights: w.highlights || [],
        location: w.location ? { city: w.location } : undefined,
    })),
    education: (r.education || []).map(e => ({
        institution: e.institution || '',
        area: e.area || '',
        studyType: e.studyType || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        score: e.score || '',
        courses: e.courses || [],
    })),
    skills: (r.skills || []).map(s => ({
        name: s.name || '',
        level: s.level || '',
        keywords: s.keywords || [],
    })),
    languages: (r.languages || []).map(l => ({
        language: l.language || '',
        fluency: l.fluency || '',
    })),
    projects: (r.projects || [])
        .filter(p => p.visibility !== 'hidden')
        .map(p => ({
            name: p.name || '',
            description: p.description || '',
            highlights: p.highlights || [],
            keywords: p.keywords || [],
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            url: p.url || '',
            entity: p.entity || '',
            type: p.type || '',
        })),
    certificates: (r.certificates || []).map(c => ({
        name: c.name || '',
        date: c.date || '',
        issuer: c.issuer || '',
        url: c.url || '',
    })),
    interests: (r.interests || []).map(i => ({
        name: i.name || '',
        keywords: i.keywords || [],
    })),
    meta: {
        canonical: b.url || '',
        lastModified: new Date().toISOString().split('T')[0],
    },
};

writeFileSync(dst, JSON.stringify(schemaResume, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.schema-resume.json — Schema Resume v1.1.0');
