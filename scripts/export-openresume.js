import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.openresume.json');
const dstDocs = resolve(dir, 'docs', 'resume.openresume.json');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;

const openResume = {
    version: '0.0.1',
    format: 'orf',
    meta: {
        name: b.name,
        sort: 'chrono',
        sort_order: 'desc',
        tags: ['software-development', 'web-development', 'full-stack'],
    },
    data: {
        personal: {
            name: b.name,
            phone_number: b.phone || '',
            email: b.email || '',
            city: b.location?.city || '',
            state: '',
            country: b.location?.countryCode || '',
            url_linkedin: (b.profiles || []).find(p => p.network === 'LinkedIn')?.url || null,
            url_website: b.url || null,
            url_portfolio: null,
            url_other: [],
        },
        summary: b.summary || '',
        education: (r.education || []).map(e => {
            const startY = parseInt(e.startDate) || 0;
            const endY = parseInt(e.endDate) || 0;
            return {
                degree_level: (e.studyType || '').toLowerCase().includes('master') ? 'masters'
                    : (e.studyType || '').toLowerCase().includes('bach') ? 'bachelors'
                    : 'other',
                degree_title: e.studyType || '',
                completed: true,
                institution: e.institution || '',
                institution_city: '',
                institution_state: '',
                major: e.area || '',
                concentration: null,
                minor: null,
                gpa: null,
                gpa_scale: null,
                start_day: null,
                start_month: null,
                start_year: isNaN(startY) ? 0 : startY,
                end_day: null,
                end_month: null,
                end_year: isNaN(endY) ? 0 : endY,
            };
        }),
        experience: (r.work || []).map(w => ({
            title: w.position || '',
            employer: w.name || w.position || 'Unknown',
            employer_city: w.location || '',
            employer_state: '',
            employer_country: null,
            description: (w.highlights || []).length > 0
                ? w.highlights
                : (w.summary ? [w.summary] : []),
        })),
        projects: (r.projects || [])
            .filter(p => p.visibility !== 'hidden')
            .map(p => ({
                title: p.name || '',
                sub_title: '',
                url: p.url || '',
                description: (p.highlights || []).length > 0
                    ? p.highlights
                    : (p.description ? [p.description] : []),
            })),
    },
};

writeFileSync(dst, JSON.stringify(openResume, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.openresume.json — OpenResume v0.0.1');
