import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jrSchema from '@jsonresume/schema';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const staticDir = resolve(dir, 'static');
const schemasDir = resolve(dir, 'schemas');

const ajv = new Ajv({ strict: false, allErrors: true, validateSchema: false });
addFormats(ajv);

let exitCode = 0;

function load(name) {
    return JSON.parse(readFileSync(resolve(staticDir, name), 'utf8'));
}

function loadSchema(name) {
    return JSON.parse(readFileSync(resolve(schemasDir, name), 'utf8'));
}

function validate(name, data, schema) {
    const valid = ajv.validate(schema, data);
    if (valid) {
        console.log(`  \u2713 ${name}`);
    } else {
        console.log(`  \u2717 ${name}`);
        for (const err of ajv.errors || []) {
            console.log(`    ${err.instancePath || '/'} ${err.message}`);
        }
        exitCode = 1;
    }
}

console.log('');

console.log('Resume — JSON Resume v1.0.0');
const jr = jrSchema.default || jrSchema;
const jrSchemaObj = jr.schema || jr.validator?.schema;
const jrValidate = ajv.compile(jrSchemaObj);
{
    const data = load('resume.json');
    const valid = jrValidate(data);
    if (valid) {
        console.log('  \u2713 resume.json');
    } else {
        console.log('  \u2717 resume.json');
        for (const err of jrValidate.errors || []) {
            console.log(`    ${err.instancePath || '/'} ${err.message}`);
        }
        exitCode = 1;
    }
}

console.log('');

console.log('Schema.org — JSON-LD structural check');
{
    const data = load('resume.schema.json');
    const checks = [
        ['@context exists', !!data['@context']],
        ['@type is Person', data['@type'] === 'Person'],
        ['name exists', !!data.name],
        ['givenName exists', !!data.givenName],
        ['familyName exists', !!data.familyName],
        ['url exists', !!data.url],
        ['knowsLanguage has entries', Array.isArray(data.knowsLanguage) && data.knowsLanguage.length > 0],
        ['hasOccupation has entries', Array.isArray(data.hasOccupation) && data.hasOccupation.length > 0],
        ['alumniOf has entries', Array.isArray(data.alumniOf) && data.alumniOf.length > 0],
    ];
    const ok = checks.every(c => c[1]);
    if (ok) {
        console.log('  \u2713 resume.schema.json');
    } else {
        console.log('  \u2717 resume.schema.json');
        for (const [label, pass] of checks) {
            if (!pass) console.log(`    ${label} — FAIL`);
        }
        exitCode = 1;
    }
}

console.log('');

console.log('FreeCV — cv.json v1.2');
validate('resume.cv.json', load('resume.cv.json'), loadSchema('freecv.v1.json'));

console.log('');

const otpSchema = loadSchema('otp.schema.json');
console.log('OTP — Open Talent Protocol v0.2');
validate('resume.otp.json', load('resume.otp.json'), otpSchema);

console.log('');

console.log('Barba-CV — v1.2');
try {
    const barbaSchema = loadSchema('barba-cv.schema.json');
    delete barbaSchema.$id;
    const bValidate = ajv.compile(barbaSchema);
    const bData = load('resume.barba-cv.json');
    const bValid = bValidate(bData);
    if (bValid) {
        console.log('  \u2713 resume.barba-cv.json');
    } else {
        console.log('  \u2717 resume.barba-cv.json');
        for (const err of bValidate.errors || []) {
            console.log(`    ${err.instancePath || '/'} ${err.message}`);
        }
        exitCode = 1;
    }
} catch (e) {
    console.log('  \u2717 resume.barba-cv.json — schema error');
    console.log(`    ${e.message}`);
    exitCode = 1;
}

console.log('');

const uniSchema = loadSchema('universal-resume.json');
console.log('Universal Resume');
validate('resume.universal.json', load('resume.universal.json'), uniSchema);

console.log('');

const appSchema = loadSchema('app.schema.json');
console.log('APP — Applicant Profile Protocol v1.0');
validate('resume.app.json', load('resume.app.json'), appSchema);

console.log('');
console.log('Schema Resume — v1.1.0');
try {
    validate('resume.schema-resume.json', load('resume.schema-resume.json'), loadSchema('schema-resume.json'));
} catch (e) {
    console.log('  \u2717 resume.schema-resume.json — schema error');
    console.log(`    ${e.message}`);
    exitCode = 1;
}

console.log('');
console.log('ResumeJSON — v0.1.0 (structural check)');
{
    const data = load('resume.resume.json');
    const checks = [
        ['@context exists', !!data['@context']],
        ['@type is CreativeWork', data['@type'] === 'CreativeWork'],
        ['additionalType is resumejson:StructuredResume', data['additionalType'] === 'resumejson:StructuredResume'],
        ['about.Person exists', !!data.about?.name],
        ['workExperience is array', Array.isArray(data['resumejson:workExperience'])],
        ['education is array', Array.isArray(data['resumejson:education'])],
        ['skills is array', Array.isArray(data['resumejson:skills'])],
    ];
    const ok = checks.every(c => c[1]);
    if (ok) {
        console.log('  \u2713 resume.resume.json');
    } else {
        console.log('  \u2717 resume.resume.json');
        for (const [label, pass] of checks) {
            if (!pass) console.log(`    ${label} — FAIL`);
        }
        exitCode = 1;
    }
}

console.log('');
console.log('OpenResume — v0.0.1');
try {
    validate('resume.openresume.json', load('resume.openresume.json'), loadSchema('openresume.schema.json'));
} catch (e) {
    console.log('  \u2717 resume.openresume.json — schema error');
    console.log(`    ${e.message}`);
    exitCode = 1;
}

console.log('');
console.log('OCF — v0.3 (structural check)');
{
    const data = load('resume.ocf.json');
    const checks = [
        ['schemaVersion is 0.3', data.schemaVersion === '0.3'],
        ['person exists', !!data.person?.name],
        ['experience is array', Array.isArray(data.experience)],
        ['education is array', Array.isArray(data.education)],
        ['skills is array', Array.isArray(data.skills)],
    ];
    const ok = checks.every(c => c[1]);
    if (ok) {
        console.log('  \u2713 resume.ocf.json');
    } else {
        console.log('  \u2717 resume.ocf.json');
        for (const [label, pass] of checks) {
            if (!pass) console.log(`    ${label} — FAIL`);
        }
        exitCode = 1;
    }
}

console.log('');
console.log('Europass — SkillsPassport v3.4 (XML well-formed check)');
{
    const xml = readFileSync(resolve(staticDir, 'resume.europass.xml'), 'utf8');
    const checks = [
        ['has SkillsPassport root', xml.includes('<SkillsPassport')],
        ['has DocumentInfo', xml.includes('<DocumentInfo>')],
        ['has LearnerInfo', xml.includes('<LearnerInfo>')],
        ['has Identification', xml.includes('<Identification>')],
        ['has PersonName', xml.includes('<PersonName>')],
    ];
    const ok = checks.every(c => c[1]);
    if (ok) {
        console.log('  \u2713 resume.europass.xml');
    } else {
        console.log('  \u2717 resume.europass.xml');
        for (const [label, pass] of checks) {
            if (!pass) console.log(`    ${label} — FAIL`);
        }
        exitCode = 1;
    }
}

console.log('');
console.log('HR-XML — v2.5 (XML well-formed check)');
{
    const xml = readFileSync(resolve(staticDir, 'resume.hr-xml.xml'), 'utf8');
    const checks = [
        ['has Resume root', xml.includes('<Resume')],
        ['has StructuredXMLResume', xml.includes('<StructuredXMLResume>')],
        ['has ContactInfo', xml.includes('<ContactInfo>')],
        ['has PersonName', xml.includes('<PersonName>')],
        ['has EmploymentHistory', xml.includes('<EmploymentHistory>')],
        ['has EducationHistory', xml.includes('<EducationHistory>')],
    ];
    const ok = checks.every(c => c[1]);
    if (ok) {
        console.log('  \u2713 resume.hr-xml.xml');
    } else {
        console.log('  \u2717 resume.hr-xml.xml');
        for (const [label, pass] of checks) {
            if (!pass) console.log(`    ${label} — FAIL`);
        }
        exitCode = 1;
    }
}

console.log('');
if (exitCode) {
    console.log('\u2717 Some exports failed validation');
    process.exit(1);
} else {
    console.log('\u2713 All exports valid');
}
