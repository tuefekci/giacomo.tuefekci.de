import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.europass.xml');
const dstDocs = resolve(dir, 'docs', 'resume.europass.xml');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;
const nameParts = b.name.split(' ');

function xml(tag, content, attrs = '') {
    if (content === undefined || content === null || content === '') return `<${tag}${attrs}/>`;
    return `<${tag}${attrs}>${esc(content)}</${tag}>`;
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function dateParts(d) {
    if (!d) return { y: '', m: '' };
    const parts = d.split('-');
    return { y: parts[0] || '', m: parts[1] || '' };
}

function period(start, end) {
    const s = dateParts(start);
    const e = dateParts(end);
    return `<Period><From>${s.y}-${s.m}</From><To>${e.y ? e.y + '-' + e.m : ''}</To></Period>`;
}

const workXml = (r.work || []).map(w => `
    <WorkExperience>
      ${period(w.startDate, w.endDate)}
      <Position><Label>${esc(w.position || '')}</Label></Position>
      <Employer><Name>${esc(w.name || w.position || 'Unknown')}</Name></Employer>
      ${w.location ? `<Location><Municipality>${esc(w.location)}</Municipality></Location>` : ''}
      ${(w.highlights || []).length ? `
      <Activities>${(w.highlights || []).map(h => `<Description>${esc(h)}</Description>`).join('\n        ')}</Activities>` : ''}
    </WorkExperience>`).join('');

const eduXml = (r.education || []).map(e => `
    <Education>
      ${period(e.startDate, e.endDate)}
      <Title>${esc(e.studyType || '')} ${esc(e.area || '')}</Title>
      <Organisation><Name>${esc(e.institution || '')}</Name></Organisation>
    </Education>`).join('');

const langXml = (r.languages || []).map(l => {
    const code = l.language === 'German' ? 'DE' : l.language === 'English' ? 'EN' : l.language;
    const level = l.fluency === 'Native' ? 'C2' : l.fluency === 'Professional' ? 'C1' : 'B2';
    return `
    <Linguistic>
      <MotherTongue><Language><Code>${code}</Code></Language></MotherTongue>
      <ForeignLanguage><Language><Code>${code}</Code><ProficiencyLevel><Listening>${level}</Listening><Reading>${level}</Reading><SpokenInteraction>${level}</SpokenInteraction><SpokenProduction>${level}</SpokenProduction><Writing>${level}</Writing></ProficiencyLevel></Language></ForeignLanguage>
    </Linguistic>`;
}).join('');

const output = `<?xml version="1.0" encoding="UTF-8"?>
<SkillsPassport xmlns="http://europass.cedefop.europa.eu/Europass"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://europass.cedefop.europa.eu/Europass
                                    http://europass.cedefop.europa.eu/xml/v3.4.0/EuropassSchema.xsd">
  <DocumentInfo>
    ${xml('DocumentType', 'ECV')}
    ${xml('CreationDate', new Date().toISOString())}
    ${xml('LastUpdateDate', new Date().toISOString())}
    ${xml('XSDVersion', 'V3.4')}
    ${xml('Generator', 'resume-to-europass v1')}
  </DocumentInfo>
  <LearnerInfo>
    <Identification>
      <PersonName>
        ${xml('FirstName', nameParts.slice(0, -1).join(' '))}
        ${xml('Surname', nameParts[nameParts.length - 1])}
      </PersonName>
      ${b.birth?.date ? xml('DateOfBirth', b.birth.date) : ''}
      ${b.location?.countryCode ? `<Nationality><Code>${b.location.countryCode}</Code></Nationality>` : ''}
      <ContactInfo>
        ${b.email ? xml('Contact', b.email, ' contactType="email"') : ''}
        ${b.phone ? xml('Contact', b.phone, ' contactType="telephone"') : ''}
        ${b.url ? xml('Contact', b.url, ' contactType="url"') : ''}
      </ContactInfo>
    </Identification>
    ${b.label ? `<Headline><Label>${esc(b.label)}</Label></Headline>` : ''}
    ${workXml ? `<WorkExperienceList>${workXml}\n  </WorkExperienceList>` : ''}
    ${eduXml ? `<EducationList>${eduXml}\n  </EducationList>` : ''}
    ${langXml ? `<Skills><Linguistic>${langXml}\n    </Linguistic></Skills>` : ''}
  </LearnerInfo>
</SkillsPassport>`;

writeFileSync(dst, output, 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.europass.xml — Europass SkillsPassport v3.4');
