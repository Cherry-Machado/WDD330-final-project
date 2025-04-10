import { minify } from 'terser';

async function minifyFiles() {
  const files = ['scripts/main.js', 'scripts/api/tmdb.js', 'scripts/api/omdb.js'];

  for (const file of files) {
    try {
      const response = await fetch(file);
      const code = await response.text();
      const result = await minify(code, {
        module: true,
        compress: true,
        mangle: true,
      });
      console.log(`Minified code for ${file}:`, result.code);
      // Use result.code as needed, e.g., save it dynamically if possible
    } catch (error) {
      console.error(`Error minifying ${file}:`, error);
    }
  }
}

minifyFiles();

/*import { minify } from 'terser';
import { readFileSync, writeFileSync } from 'fs';

async function minifyFiles() {
  const files = ['scripts/main.js', 'scripts/*.js', 'scripts/api/*.js'];

  for (const file of files) {
    const code = readFileSync(file, 'utf8');
    try {
      const result = await minify(code, {
        module: true,
        compress: true,
        mangle: true,
      });
      writeFileSync(file.replace('.js', '.min.js'), result.code);
    } catch (error) {
      console.error(`Error minifying ${file}:`, error);
    }
  }
}

minifyFiles();
*/
/*
async function minifyFiles() {
  // List of JS files to minify (must be accessible via URL if running in browser)
  const files = [
    '../main.js',
    // Add other JS file paths (must be relative to the HTML file or a full URL)
  ];

  for (const file of files) {
    try {
      // 1. Fetch the JS file (browser-compatible)
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      const code = await response.text();

      // 2. Minify the code (Terser works in browser too)
      const result = await minify(code, {
        module: true,
        compress: true,
        mangle: true,
      });

      // 3. Offer the minified version as a download (since we can't write to disk)
      const blob = new Blob([result.code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.replace('.js', '.min.js');
      a.click();
      URL.revokeObjectURL(url);

      console.log(`Minified ${file} and triggered download`);
    } catch (error) {
      console.error(`Error minifying ${file}:`, error);
    }
  }
}

// Run only if in a browser environment (not in Node.js)
if (typeof window !== 'undefined') {
  minifyFiles();
}
*/
