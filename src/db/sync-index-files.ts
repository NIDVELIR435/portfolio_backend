import { join } from 'path';
import { readdir, writeFileSync } from 'fs';

const skipFolder = (name: string) => /(.ts)$/gm.test(name);

const skipFoldersAndIndexFile = (name: string) =>
  name !== 'index.ts' && skipFolder(name);

const assembleExport = (name: string) =>
  `export * from './${name.split('.ts')[0]}';`;

const assembleAllExports = (fileNames: string[]) =>
  fileNames
    .filter(skipFoldersAndIndexFile)
    .map((name) => assembleExport(name))
    .join('\n');

//assembles index file in migrations folder
readdir(join(__dirname, 'migrations'), (_err, fileNames) => {
  writeFileSync(
    join(__dirname, 'migrations', 'index.ts'),
    assembleAllExports(fileNames),
  );
});

//assembles index file in entities folder
readdir(join(__dirname, 'entities'), (_err, fileNames) => {
  writeFileSync(
    join(__dirname, 'entities', 'index.ts'),
    assembleAllExports(fileNames),
  );
});
