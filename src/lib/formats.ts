export interface ResumeFormat {
    name: string
    format: string
    mediaType: string
    filename: string
    specUrl: string
    description: string
}

export const formats: ResumeFormat[] = [
    {
        name: 'JSON Resume',
        format: 'clean JSON Resume v1.0.0',
        mediaType: 'application/json',
        filename: 'resume.json',
        specUrl: 'https://jsonresume.org/schema/',
        description: 'Standard JSON Resume format — widely supported by resume parsers and tools',
    },
    {
        name: 'Schema.org JSON-LD',
        format: 'Schema.org JSON-LD',
        mediaType: 'application/ld+json',
        filename: 'resume.schema.json',
        specUrl: 'https://schema.org/Person',
        description: 'Structured data following Schema.org Person schema for semantic SEO',
    },
    {
        name: 'Schema Resume',
        format: 'Schema Resume v1.1.0',
        mediaType: 'application/ld+json',
        filename: 'resume.schema-resume.json',
        specUrl: 'https://schema-resume.org/schema.json',
        description: 'JSON-LD format aligned with schema-resume.org specification',
    },
    {
        name: 'ResumeJSON',
        format: 'ResumeJSON v0.1.0',
        mediaType: 'application/json',
        filename: 'resume.resume.json',
        specUrl: 'https://auth.careers/schema/',
        description: 'ResumeJSON format designed for authentication and career platforms',
    },
    {
        name: 'Open Talent Protocol',
        format: 'Open Talent Protocol v0.2',
        mediaType: 'application/json',
        filename: 'resume.otp.json',
        specUrl: 'https://opentalentprotocol.com',
        description: 'Open standard for talent and career data exchange',
    },
    {
        name: 'OpenResume',
        format: 'OpenResume v0.0.1',
        mediaType: 'application/json',
        filename: 'resume.openresume.json',
        specUrl: 'https://openresume.org',
        description: 'OpenResume ORF format for structured resume data',
    },
    {
        name: 'OCF',
        format: 'OCF v0.3 (lean master)',
        mediaType: 'application/json',
        filename: 'resume.ocf.json',
        specUrl: 'https://github.com/open-candidate-format/ocf-schema',
        description: 'Open Candidate Format — lean candidate data exchange standard',
    },
    {
        name: 'Universal Resume',
        format: 'Universal Resume',
        mediaType: 'application/json',
        filename: 'resume.universal.json',
        specUrl: 'https://github.com/universal-resume/json-schema',
        description: 'Universal Resume JSON schema for cross-platform compatibility',
    },
    {
        name: 'FreeCV',
        format: 'FreeCV / cv.json format',
        mediaType: 'application/json',
        filename: 'resume.cv.json',
        specUrl: 'https://freecv.org/schema/cv/v1.json',
        description: 'FreeCV open-source resume format',
    },
    {
        name: 'Barba-CV',
        format: 'Barba-CV v1.2',
        mediaType: 'application/json',
        filename: 'resume.barba-cv.json',
        specUrl: 'https://github.com/BarbaCV/schema',
        description: 'Barba-CV schema for multilingual resume representation',
    },
    {
        name: 'Applicant Profile Protocol',
        format: 'Applicant Profile Protocol v1.0',
        mediaType: 'application/json',
        filename: 'resume.app.json',
        specUrl: 'https://app-protocol.org/schema/app-1.0.json',
        description: 'Standardized applicant profile format for HR systems',
    },
    {
        name: 'HR-XML',
        format: 'HR-XML v2.5',
        mediaType: 'application/xml',
        filename: 'resume.hr-xml.xml',
        specUrl: 'https://www.hr-xml.org',
        description: 'HR-XML consortium standard for resume and skills data',
    },
    {
        name: 'Europass',
        format: 'Europass SkillsPassport v3.4',
        mediaType: 'application/xml',
        filename: 'resume.europass.xml',
        specUrl: 'https://europass.europa.eu',
        description: 'European standardised skills passport format',
    },
]
