#!/usr/bin/env node
// @ts-check
import { parseArgs } from 'node:util';
import * as fs from 'node:fs/promises';
import * as url from 'node:url';
import { readPackageVersion, exists, calculateNextVersion, isGit, isGitClean, runCommand } from './util.mjs';
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
      all: {
        type: 'boolean',
        default: false,
        description: 'Show all versions',
      },
      message: {
        type: 'string',
        description: 'Changelog message',
        short: 'm'
      },
      patch: {
        type: 'boolean',
        description: 'Indicates that the current change is a patch-level change.',
      },
      minor: {
        type: 'boolean',
        description: 'Indicates that the current change is a minor change.',
      },
      major: {
        type: 'boolean',
        description: 'Indicates that the current change is a major change.',
      },
      nowrap: {
        type: 'boolean',
        description: 'Don\'t wrap "show" output'
      },
      force: {
        type: 'boolean',
        description: 'Ignore some errors and try anyway.',
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
      /** @type {'major' | 'minor' | 'patch'} */
      let changeType = 'patch';
      if (values.minor) {
        changeType = 'minor';
      }
      if (values.major) {
        changeType = 'major';
      }
      if (!values.message) {
        if (positionals.length>1) {
          // We also support setting a message after the command instead of -m
          values.message = positionals.slice(1).join(' ');
        } else {
          throw new Error('The "-m" or "--message" argument is required');
        }
      }
      await add({
        message: values.message,
        changeType,
      });
      break;
    case 'release' :
      await release(values.force);
      break;
    case 'format' :
      await format();
      break;
    case 'show' :
      await show({
        all: !!values.all,
        version: positionals[1],
        noWrap: !!values.nowrap
      });
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

  changelog init             - Create a new, empty changelog.
  changelog add -m [message] - Adds a new line to the changelog.
  changelog release          - Marks the current changelog as released.
  changelog show             - Show the last changelog.
  changelog show [version]   - Show the changelog of a specific version.
  changelog list             - List all versions in the changelog.
  changelog format           - Reformats the changelog in the standard format.

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

  const changelog = await parseChangelog();

  for(const version of changelog.versions) {
    console.log(version.version);
  }

}

/**
 * @param {Object} showOptions
 * @param {boolean} showOptions.all Show all versions
 * @param {string?} showOptions.version show a specific version
 * @param {boolean?} showOptions.noWrap don't line-wrap output
 */
async function show({all, version, noWrap}) {

  const changelog = await parseChangelog();

  let toRender;
  if (all) {
    toRender = changelog.versions;
  } else if (version) {
    toRender = [changelog.get(version)];
  } else {
    toRender = [changelog.versions[0]];
  }

  console.log(
    toRender
      .map( log => log.output(!noWrap))
      .join('\n\n')
  );

}

async function format() {
  const changelog = await parseChangelog();
  await fs.writeFile(filename, changelog.toString());
  console.log(`${changelog.versions.length} changelogs saved to ${filename}`);
}

/**
 * @param {Object} options
 * @param {string} options.message
 * @param {'patch'|'major'|'minor'} options.changeType
 */
async function add({message, changeType}) {
  const changelog = await parseChangelog();

  let lastVersion = changelog.versions[0];
  if (lastVersion.date) {
    lastVersion = changelog.newVersion(changeType);
    console.log('Creating new version: %s', lastVersion.version);
  } else {
    if (changeType === 'minor' || changeType === 'major') {
      const previousVersion = changelog.versions[1];
      const updatedVersionStr = calculateNextVersion(previousVersion.version, changeType);
      if (updatedVersionStr !== lastVersion.version) {
        console.log('Updating unreleased version from %s to %s', lastVersion.version, updatedVersionStr);
        lastVersion.version = updatedVersionStr;
      }
    }
  }

  lastVersion.add(message);

  await fs.writeFile(filename, changelog.toString());
  console.log(`${changelog.versions.length} changelogs saved to ${filename}`);
}

async function release(force = false) {
  const changelog = await parseChangelog();

  let lastVersion = changelog.versions[0];
  if (lastVersion.date) {
    throw new Error(`Previous version "${lastVersion.version}" already had a release date`);
  }
  lastVersion.date = new Date().toISOString().substr(0,10);
  console.log(`Releasing ${lastVersion.version}`);

  const useGit = await isGit();

  if (useGit) {
    if (!isGitClean()) {
      if (force) {
        console.warn('Warning: Git working directory is not clean. Ignoring.');
      } else {
        throw new Error('Current git working directory is not clean. Please commit your changes first');
      }
    }
  }

  await fs.writeFile(filename, changelog.toString());
  console.log(`${changelog.versions.length} changelogs saved to ${filename}`);

  if (await exists('package.json')) {
    runCommand(
      `npm version "${lastVersion.version}" --no-git-tag-version`
    );
  }
  if (useGit) {
    runCommand(`git add --all`);
    runCommand(`git commit -m "Releasing ${lastVersion.version}"`);
    runCommand(`git tag v${lastVersion.version}`);
  }

}

/**
 * @returns {Promise<Changelog>}
 */
async function parseChangelog() {

  if (!await exists(filename)) {
    throw new Error(`${filename} not found in current directory`);
  }

  return await parseFile(filename);

}
