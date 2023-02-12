// @ts-check
import { parseArgs } from 'node:util';
import * as fs from 'node:fs/promises';
import * as url from 'node:url';
import { readPackageVersion, exists } from './util.mjs';
import { Changelog, VersionLog, LogItem } from './changelog.mjs';
import { parseFile } from './parse.mjs';

const filename = 'changelog.md';

const pkg = JSON.parse(
  await fs.readFile(
    url.fileURLToPath(url.resolve(import.meta.url, './package.json')),
    'utf-8',
  )
);

async function main() {

  const { positionals, values } = parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
        description: 'This help screen',
      },
    },
    allowPositionals: true,
  });



  if (positionals.length < 1 || values.help) {
    help();
    process.exit(1);
  }

  const command = positionals[0];

  switch(command) {
    case 'help' :
      await help();
      break;
    case 'init' :
      await init();
      break;
    case 'add' :
      await add();
      break;
    case 'release' :
      await release();
      break;
    case 'show' :
      await show();
      break;
    case 'list' :
      await list();
      break;
    default:
      process.stderr.write(`Unknown command ${command}\n`);
      process.exit(1);
      break;
  }

}

try {
  await main();
} catch (err) {
  process.stderr.write('Error: ' + err.message + '\n');
  process.exit(1);
}

function help() {
  console.log(
`Changelog Tool v${pkg.version}

Manipulate your changelog file

Usage:

  changelog init           - Create a new, empty changelog.
  changelog add [message]  - Adds a new line to the changelog.
  changelog release        - Marks the current changelog as released.
  changelog show           - Show the last changelog.
  changelog show [version] - Show the changelog of a specific version.
  changelog list           - List all versions in the changelog.

The logs this tool uses follows a specific markdown format. Currently it will
only look for a file named 'changelog.md' in the current directory.

To see an example of this format, you can either run 'changelog init' or
check out the changelog shipped with this project:

https://github.com/evert/changelog-tool
`);

}

async function init() {

  if (await exists(filename)) {
    throw new Error(`A file named ${filename} already exists`); 
  }

  const changelog = new Changelog();
  const version = new VersionLog(await readPackageVersion());
  version.add('New project!');
  changelog.versions.push(version); 

  await fs.writeFile(filename, changelog.toString());
  console.log(`${filename} created`);

}

async function list() {

  if (!await exists(filename)) {
    throw new Error(`${filename} not found in current directory`);
  }

  const changelog = await parseFile(filename);

  for(const version of changelog.versions) {
    console.log(version.version);
  }

}
