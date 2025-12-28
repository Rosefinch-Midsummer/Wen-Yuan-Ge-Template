import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_DIR = path.join(__dirname, 'public', 'Files');
const OUTPUT_FILE = path.join(__dirname, 'public', 'files.json');

function getFileTree(dir, relativePath = 'Files') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  const tree = items.map(item => {
    const itemPath = path.join(relativePath, item.name);
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      return {
        name: item.name,
        type: 'directory',
        path: itemPath.replace(/\\/g, '/'),
        children: getFileTree(fullPath, itemPath)
      };
    } else {
      const stats = fs.statSync(fullPath);
      return {
        name: item.name,
        type: 'file',
        path: itemPath.replace(/\\/g, '/'),
        size: stats.size,
        extension: path.extname(item.name).toLowerCase(),
        lastModified: stats.mtime
      };
    }
  });

  // Sort directories first, then files
  return tree.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });
}

try {
  if (!fs.existsSync(FILES_DIR)) {
    console.log('Creating Files directory...');
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }

  console.log('Scanning files...');
  const tree = getFileTree(FILES_DIR);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2));
  console.log(`File list generated at ${OUTPUT_FILE}`);
} catch (error) {
  console.error('Error generating file list:', error);
}
