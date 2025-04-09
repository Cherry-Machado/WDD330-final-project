import { minify } from 'terser';
import { readFileSync, writeFileSync } from 'fs';

async function minifyFiles() {
  const files = ['scripts/main.js', 'scripts/*.js', 'scripts/api/*.js'];

  for (const file of files) {
    const code = readFileSync(file, 'utf8');
    const result = await minify(code, {
      module: true,
      compress: true,
      mangle: true,
    });
    writeFileSync(file.replace('.js', '.min.js'), result.code);
  }
}

minifyFiles();
