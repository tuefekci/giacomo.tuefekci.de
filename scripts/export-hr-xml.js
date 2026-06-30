import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');
const dst = resolve(dir, 'static', 'resume.hr-xml.xml');
const dstDocs = resolve(dir, 'docs', 'resume.hr-xml.xml');

const r = JSON.parse(readFileSync(src, 'utf8'));
const b = r.basics;
const nameParts = b.name.split(' ');

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ym(d) {
    if (!d) return '';
    const p = d.split('-');
    return `${p[0]}-${p[1] || '01'}`;
}

const contactMethodXml = `
      <ContactMethod>
        ${b.phone ? `<Telephone><FormattedNumber>${esc(b.phone)}</FormattedNumber></Telephone>` : ''}
        ${b.email ? `<InternetEmailAddress>${esc(b.email)}</InternetEmailAddress>` : ''}
        ${b.url ? `<InternetWebAddress>${esc(b.url)}</InternetWebAddress>` : ''}
        ${b.location ? `<PostalAddress>
          <CountryCode>${esc(b.location.countryCode || '')}</CountryCode>
          <Municipality>${esc(b.location.city || '')}</Municipality>
        </PostalAddress>` : ''}
      </ContactMethod>`;

const workXml = (r.work || []).map(w => `
      <EmployerOrg>
        <EmployerOrgName>${esc(w.name || w.position || 'Unknown')}</EmployerOrgName>
        <PositionHistory>
          <Title>${esc(w.position || '')}</Title>
          ${w.summary ? `<Description>${esc(w.summary)}</Description>` : ''}
          <StartDate><YearMonth>${ym(w.startDate)}</YearMonth></StartDate>
          ${w.endDate ? `<EndDate><YearMonth>${ym(w.endDate)}</YearMonth></EndDate>` : ''}
          ${(w.highlights || []).map(h => `<Competency description="${esc(h)}"/>`).join('\n          ')}
        </PositionHistory>
      </EmployerOrg>`).join('');

const eduXml = (r.education || []).map(e => `
      <SchoolOrInstitution schoolType="University">
        <SchoolName>${esc(e.institution || '')}</SchoolName>
        <Degree degreeType="${esc((e.studyType || '').toLowerCase().replace(' ', '-') || 'other')}">
          <DegreeName>${esc(e.studyType || '')} in ${esc(e.area || '')}</DegreeName>
          ${e.endDate ? `<DegreeDate><Year>${e.endDate.split('-')[0]}</Year></DegreeDate>` : ''}
          ${e.area ? `<DegreeMajor><Name>${esc(e.area)}</Name></DegreeMajor>` : ''}
        </Degree>
      </SchoolOrInstitution>`).join('');

const skillXml = (r.skills || []).filter(s => s.keywords?.length).map(s =>
    s.keywords.map(k => `
      <Competency name="${esc(k)}">
        <CompetencyEvidence><Description>${esc(s.name || '')} — ${esc(s.level || '')}</Description></CompetencyEvidence>
      </Competency>`).join('')
).join('');

const output = `<?xml version="1.0" encoding="UTF-8"?>
<Resume xmlns="http://ns.hr-xml.org/2007-04-15"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://ns.hr-xml.org/2007-04-15 https://s3.amazonaws.com/Build_2_5/HR-XML-2_5/SEP/Resume.xsd"
        xml:lang="EN">
  <StructuredXMLResume>
    <ContactInfo>
      <PersonName>
        <GivenName>${esc(nameParts.slice(0, -1).join(' '))}</GivenName>
        <FamilyName>${esc(nameParts[nameParts.length - 1])}</FamilyName>
      </PersonName>
      ${contactMethodXml}
    </ContactInfo>
    ${b.summary ? `<ExecutiveSummary>${esc(b.summary)}</ExecutiveSummary>` : ''}
    ${b.label ? `<Objective>${esc(b.label)}</Objective>` : ''}
    ${workXml ? `<EmploymentHistory>${workXml}\n    </EmploymentHistory>` : ''}
    ${eduXml ? `<EducationHistory>${eduXml}\n    </EducationHistory>` : ''}
    ${skillXml ? `<Qualifications><QualificationSummary>Skills</QualificationSummary>${skillXml}\n    </Qualifications>` : ''}
    <Languages>
      ${(r.languages || []).map(l => `
      <Language>
        <LanguageCode>${l.language === 'German' ? 'DE' : l.language === 'English' ? 'EN' : l.language}</LanguageCode>
        <Read>${l.fluency || ''}</Read>
        <Write>${l.fluency || ''}</Write>
        <Speak>${l.fluency || ''}</Speak>
      </Language>`).join('')}
    </Languages>
    <RevisionDate>${new Date().toISOString().split('T')[0]}</RevisionDate>
  </StructuredXMLResume>
</Resume>`;

writeFileSync(dst, output, 'utf8');
copyFileSync(dst, dstDocs);
console.log('✓ static/resume.hr-xml.xml — HR-XML v2.5');
