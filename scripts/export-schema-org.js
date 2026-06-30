import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.schema.json');
const dstDocs = resolve(dir, 'docs', 'resume.schema.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const b = resume.basics;

const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": b.url,
    "name": b.name,
    "givenName": b.name.split(" ").slice(0, -1).join(" "),
    "familyName": b.name.split(" ").pop(),
    "jobTitle": b.label,
    "description": b.summary,
    "url": b.url,
    "email": b.email,
    "telephone": b.phone,
    "image": b.image,
    "birthDate": b.birth?.date,
    "nationality": {
        "@type": "Country",
        "name": b.birth?.countryCode || b.location?.countryCode
    },
    "address": {
        "@type": "PostalAddress",
        "addressLocality": b.location?.city,
        "addressCountry": b.location?.countryCode
    },
    "knowsLanguage": resume.languages.map(l => ({
        "@type": "Language",
        "name": l.language
    })),
    "knowsAbout": resume.skills.flatMap(s => s.keywords || []),
    "hasOccupation": resume.work.map(w => ({
        "@type": "Occupation",
        "name": w.position,
        "description": w.summary,
        "startDate": w.startDate,
        "endDate": w.endDate,
        "employer": {
            "@type": "Organization",
            "name": w.name,
            "location": w.location ? { "@type": "Place", "address": w.location } : undefined
        }
    })),
    "alumniOf": resume.education.map(e => ({
        "@type": "EducationalOrganization",
        "name": e.institution,
        "description": `${e.studyType} in ${e.area}`
    })),
    "knowsAbout": [
        ...new Set(resume.skills.flatMap(s => s.keywords || []))
    ],
    "worksFor": [...new Set(resume.work.filter(w => w.name).map(w => w.name))].map(name => ({
        "@type": "Organization",
        "name": name
    }))
};

// Add profiles (sameAs)
const sameAs = (b.profiles || []).map(p => p.url).filter(Boolean);
if (sameAs.length) ld.sameAs = sameAs;

// Add skills with level
ld.skill = resume.skills.map(s => ({
    "@type": "DefinedTerm",
    "name": s.name,
    "description": s.summary,
    "inDefinedTermSet": s.level
}));

writeFileSync(dst, JSON.stringify(ld, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.schema.json — Schema.org JSON-LD');
