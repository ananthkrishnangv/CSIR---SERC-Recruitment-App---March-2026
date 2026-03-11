const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/!session \|\| session\.user\.role !== "ADMIN"/g, '!session?.user || session.user.role !== "ADMIN"');
  fs.writeFileSync(filePath, content);
}

const files = [
  'app/api/admin/applications/bulk/route.ts',
  'app/api/admin/jobs/route.ts',
  'app/admin/jobs/page.tsx',
  'app/admin/applications/[jobId]/page.tsx',
  'app/admin/applications/page.tsx',
  'app/admin/dashboard/page.tsx'
];

files.forEach(replaceInFile);
console.log('Replacements complete.');
