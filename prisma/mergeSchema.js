// This script concatenates all model and enum files into schema.prisma
// Usage: node prisma/merge-schema.js

const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname);
const schemaPath = path.join(prismaDir, 'schema.prisma');
const modelsDir = path.join(prismaDir, 'models');
const enumsDir = path.join(prismaDir, 'enums');


// Read only generator and datasource blocks from schema.prisma (ignore everything after)
function getHeaderBlocks(schemaFile) {
  const content = fs.readFileSync(schemaFile, 'utf8');
  const generatorMatch = content.match(/generator[\s\S]*?\{[\s\S]*?\}/);
  const datasourceMatch = content.match(/datasource[\s\S]*?\{[\s\S]*?\}/);
  let blocks = [];
  if (generatorMatch) blocks.push(generatorMatch[0]);
  if (datasourceMatch) blocks.push(datasourceMatch[0]);
  return blocks.join('\n\n');
}

const schemaHeader = getHeaderBlocks(schemaPath);

function concatFiles(dir) {
  if (!fs.existsSync(dir)) return '';
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.prisma'))
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))
    .join('\n\n');
}

const models = concatFiles(modelsDir);
const enums = concatFiles(enumsDir);

const merged = [schemaHeader, models, enums].filter(Boolean).join('\n\n');

fs.writeFileSync(schemaPath, merged, 'utf8');
console.log('schema.prisma updated with all models and enums.');
