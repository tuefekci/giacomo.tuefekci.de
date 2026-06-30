import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.ocf.json');
const dstDocs = resolve(dir, 'docs', 'resume.ocf.json');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;

const nameParts = b.name.split(' ');

const ocf = {
    schemaVersion: '0.3',
    meta: {
        fileRole: 'candidate-master',
        language: 'en',
    },
    person: {
        name: {
            renderAs: b.name,
            given: nameParts.slice(0, -1).join(' '),
            family: nameParts.pop(),
        },
        headline: b.label || '',
        summary: b.summary || '',
        contacts: [
            { type: 'email', value: b.email },
            { type: 'phone', value: b.phone },
            { type: 'url', value: b.url },
        ].filter(c => c.value),
        locations: [
            {
                city: b.location?.city || '',
                country: b.location?.countryCode || '',
            },
        ],
    },
    experience: (r.work || []).map(w => ({
        kind: (w.position || '').toLowerCase().includes('freelance')
            ? 'self-employed'
            : 'employment',
        organizationRef: w.name || w.position || 'Unknown',
        positions: [
            {
                title: w.position || '',
                dateRange: {
                    start: w.startDate || '',
                    end: w.endDate || '',
                },
                summary: w.summary || '',
                achievements: (w.highlights || []).map(h => ({
                    description: h,
                })),
            },
        ],
    })),
    education: (r.education || []).map(e => ({
        institution: e.institution || '',
        degree: e.studyType || '',
        field: e.area || '',
        dateRange: {
            start: e.startDate || '',
            end: e.endDate || '',
        },
    })),
    skills: (r.skills || []).flatMap(s =>
        (s.keywords || []).map(k => ({
            name: k,
            category: s.name || '',
            level: s.level || '',
        }))
    ),
    languages: (r.languages || []).map(l => ({
        language: l.language || '',
        proficiency: l.fluency || '',
    })),
};

writeFileSync(dst, JSON.stringify(ocf, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.ocf.json — OCF v0.3 (lean master)');
