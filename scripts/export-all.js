import { execSync } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..');

const scripts = [
    'export-jsonresume.js',
    'export-schema-org.js',
    'export-freecv.js',
    'export-otp.js',
    'export-barbacv.js',
    'export-universal.js',
    'export-app.js',
    'export-schema-resume.js',
    'export-resume-json.js',
    'export-openresume.js',
    'export-ocf.js',
    'export-europass.js',
    'export-hr-xml.js',
];

let failed = false;
for (const script of scripts) {
    try {
        execSync(`node "${resolve(dir, script)}"`, { stdio: 'inherit' });
    } catch {
        console.error(`✗ ${script} failed`);
        failed = true;
    }
}

if (failed) {
    console.error('\n✗ One or more exports failed');
    process.exit(1);
} else {
    console.log('\n✓ All exports complete');
}
