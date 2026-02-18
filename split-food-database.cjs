const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = 'public/Data/FoodData_Central_branded_food_json_2025-04-24.json';
const OUTPUT_DIR = 'public/Data/chunks';
const CHUNK_SIZE = 10000; // Items per chunk

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Starting to split large JSON file...');
console.log('This may take several minutes for a 3.1GB file...\n');

// Stream read the JSON file
const readStream = fs.createReadStream(INPUT_FILE, { encoding: 'utf8' });
let buffer = '';
let bracketCount = 0;
let inString = false;
let escapeNext = false;
let currentObject = '';
let items = [];
let chunkIndex = 0;
let totalItems = 0;

function saveChunk(items, index) {
  const chunkFile = path.join(OUTPUT_DIR, `branded_foods_chunk_${index.toString().padStart(3, '0')}.json`);
  fs.writeFileSync(chunkFile, JSON.stringify(items, null, 2));
  console.log(`✓ Saved chunk ${index}: ${items.length} items -> ${chunkFile}`);
}

readStream.on('data', (chunk) => {
  for (let i = 0; i < chunk.length; i++) {
    const char = chunk[i];
    
    if (escapeNext) {
      currentObject += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      currentObject += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      currentObject += char;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        if (bracketCount === 0) {
          currentObject = '{';
        } else {
          currentObject += char;
        }
        bracketCount++;
      } else if (char === '}') {
        bracketCount--;
        currentObject += char;
        
        if (bracketCount === 0 && currentObject) {
          try {
            const obj = JSON.parse(currentObject);
            items.push(obj);
            totalItems++;
            
            if (items.length >= CHUNK_SIZE) {
              saveChunk(items, chunkIndex);
              chunkIndex++;
              items = [];
            }
            
            if (totalItems % 10000 === 0) {
              process.stdout.write(`\rProcessed ${totalItems.toLocaleString()} items...`);
            }
          } catch (e) {
            // Skip invalid objects
          }
          currentObject = '';
        }
      } else if (bracketCount > 0) {
        currentObject += char;
      }
    } else {
      if (bracketCount > 0) {
        currentObject += char;
      }
    }
  }
});

readStream.on('end', () => {
  // Save remaining items
  if (items.length > 0) {
    saveChunk(items, chunkIndex);
    chunkIndex++;
  }
  
  console.log(`\n✅ Done! Split ${totalItems.toLocaleString()} items into ${chunkIndex} chunks.`);
  console.log(`Chunks saved to: ${OUTPUT_DIR}`);
  
  // Create index file
  const index = {
    totalChunks: chunkIndex,
    totalItems: totalItems,
    itemsPerChunk: CHUNK_SIZE,
    chunks: Array.from({ length: chunkIndex }, (_, i) => `branded_foods_chunk_${i.toString().padStart(3, '0')}.json`)
  };
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`✓ Created index.json with metadata`);
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});
