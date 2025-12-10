// This script splits schema.prisma into separate model and enum files.
// Usage: node prisma/split-schema.js

const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname);
const schemaPath = path.join(prismaDir, 'schema.prisma');
const modelsDir = path.join(prismaDir, 'models');
const enumsDir = path.join(prismaDir, 'enums');

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir);
if (!fs.existsSync(enumsDir)) fs.mkdirSync(enumsDir);

const schema = fs.readFileSync(schemaPath, 'utf8');

// Extract all model blocks
const modelRegex = /model\s+(\w+)\s+\{[\s\S]*?\}/g;
let match;
while ((match = modelRegex.exec(schema)) !== null) {
  const name = match[1];
  const body = match[0];
  fs.writeFileSync(path.join(modelsDir, `${name}.prisma`), body + '\n', 'utf8');
}

// Extract all enum blocks
const enumRegex = /enum\s+(\w+)\s+\{[\s\S]*?\}/g;
while ((match = enumRegex.exec(schema)) !== null) {
  const name = match[1];
  const body = match[0];
  fs.writeFileSync(path.join(enumsDir, `${name}.prisma`), body + '\n', 'utf8');
}

console.log('schema.prisma split into models/ and enums/ folders.');
