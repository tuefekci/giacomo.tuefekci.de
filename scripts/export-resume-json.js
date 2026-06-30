import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.resume.json');
const dstDocs = resolve(dir, 'docs', 'resume.resume.json');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;

const profiles = (b.profiles || []).map(p => ({
    '@type': 'resumejson:SocialProfile',
    'resumejson:platform': p.network || '',
    'resumejson:username': p.username || '',
    url: p.url || '',
}));

const resumeJson = {
    '@context': {
        '@vocab': 'https://schema.org/',
        'resumejson': 'https://auth.careers/schema/',
    },
    '@type': 'CreativeWork',
    'additionalType': 'resumejson:StructuredResume',
    about: {
        '@type': 'Person',
        givenName: b.name.split(' ').slice(0, -1).join(' '),
        familyName: b.name.split(' ').pop(),
        name: b.name,
        jobTitle: b.label || '',
        description: b.summary || '',
        url: b.url || '',
        image: b.image || '',
    },
    'resumejson:address': b.location
        ? {
            '@type': 'PostalAddress',
            addressLocality: b.location.city || '',
            addressCountry: b.location.countryCode || '',
            addressRegion: b.location.region || '',
        }
        : null,
    'resumejson:contactPoints': [
        {
            '@type': 'ContactPoint',
            email: b.email || '',
            telephone: b.phone || '',
        },
    ],
    'resumejson:socialProfiles': profiles,
    'resumejson:workExperience': (r.work || []).map(w => ({
        '@type': 'OrganizationRole',
        roleName: w.position || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        'resumejson:responsibilities': w.summary || '',
        'resumejson:achievements': w.highlights || [],
        employer: {
            '@type': 'Organization',
            name: w.name || w.position || 'Unknown',
            url: w.url || '',
        },
    })),
    'resumejson:education': (r.education || []).map(e => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: e.studyType || '',
        name: e.area || '',
        description: `${e.studyType || ''} in ${e.area || ''}`.trim(),
        dateCreated: e.startDate || '',
        dateModified: e.endDate || '',
        recognizedBy: {
            '@type': 'Organization',
            name: e.institution || '',
        },
    })),
    'resumejson:skills': (r.skills || []).map(s => ({
        '@type': 'DefinedTerm',
        name: s.name || '',
        'resumejson:proficiencyLevel': s.level || '',
        'resumejson:yearsOfExperience': undefined,
        termCode: (s.keywords || []).join(', '),
    })),
    'resumejson:certifications': (r.certificates || []).map(c => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: c.name || '',
        dateCreated: c.date || '',
        recognizedBy: {
            '@type': 'Organization',
            name: c.issuer || '',
        },
        url: c.url || '',
    })),
    'resumejson:projects': (r.projects || [])
        .filter(p => p.visibility !== 'hidden')
        .map(p => ({
            '@type': 'CreativeWork',
            additionalType: 'resumejson:Project',
            name: p.name || '',
            description: p.description || '',
            url: p.url || '',
            dateCreated: p.startDate || '',
            dateModified: p.endDate || '',
            keywords: p.keywords || '',
        })),
    'resumejson:languages': (r.languages || []).map(l => ({
        '@type': 'resumejson:LanguageProficiency',
        name: l.language || '',
        'resumejson:proficiencyLevel': l.fluency || '',
    })),
    'resumejson:awards': [],
    'resumejson:publications': [],
    'resumejson:volunteering': [],
};

writeFileSync(dst, JSON.stringify(resumeJson, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.resume.json — ResumeJSON v0.1.0');
