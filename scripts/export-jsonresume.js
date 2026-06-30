import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.json');
const dstDocs = resolve(dir, 'docs', 'resume.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const clean = JSON.parse(JSON.stringify(resume));

delete clean.basics.birth;
delete clean.basics.availability;
delete clean.basics.salary_band;
delete clean.basics.industries;
delete clean.basics.notice_period;

clean.education.forEach(e => delete e.location);
clean.skills.forEach(s => delete s.summary);
clean.interests.forEach(i => delete i.summary);

clean.projects.forEach(p => {
    delete p.featured;
    delete p.category;
    delete p.image;
    delete p.customer;
    delete p.type;
});

writeFileSync(dst, JSON.stringify(clean, null, 2), 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.json — clean JSON Resume v1.0.0');
