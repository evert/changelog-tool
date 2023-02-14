// @ts-check
import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Checks if a file exists
 *
 * @param {string} filename
 * @returns {Promise<boolean>}
 */
export async function exists(filename) {

  try {
  await fs.stat(filename)
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
  return true;

}

/**
 * Returns the version property of the package.json file in the current
 * directory.
 *
 * @returns {Promise<string>}
 */
export async function readPackageVersion() {

  if (!await exists('package.json')) {
    throw new Error('package.json does not exists in the current directory');
  }

  const json = JSON.parse(
    await fs.readFile(
      'package.json',
      'utf-8'
    )
  );

  return json.version;

}

/**
 * Wraps a line over multiple lines.
 *
 * @param {string} input
 * @param {number} secondLineOffset
 * @param {number} lineLength
 */
export function wrap(input, secondLineOffset = 0, lineLength = 79) {

  const words = input.split(' ');
  const lines = [];
  for(const word of words) {

    if (!lines.length) {
      // First line
      lines.push(word);
      continue;
    }

    const maxLength = lines.length > 1 ? lineLength - secondLineOffset : lineLength;

    const potentialNewLine = [lines.at(-1),word].join(' ');
    if (potentialNewLine.length>maxLength) {
      lines.push(word);
    } else {
      lines[lines.length-1] = potentialNewLine;
    }

  }
  return lines.join('\n' + ' '.repeat(secondLineOffset));

}

/**
 * @param {string} prevVersion
 * @param {'patch'|'minor'|'major'} changeType
 * @returns {string}
 */
export function calculateNextVersion(prevVersion, changeType = 'patch') {

  // This function only currently understands 1 format, but this may change
  // in the future.
  if (!prevVersion.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)) {
    throw new Error(`Could not automatically determine the next ${changeType} version from ${prevVersion}. You might want to request a new feature to support this`);
  }

  const parts = prevVersion.split('.').map( part => +part);

  switch(changeType) {
    case 'major' :
      parts[0]++;
      parts[1]=0;
      parts[2]=0;
      break;
    case 'minor' :
      parts[1]++;
      parts[2]=0;
      break;
    case 'patch' :
      parts[2]++;
      break;
  }

  return parts.join('.');

}

/**
 * Returns true if we're in a git-powered directory
 *
 * @returns {Promise<boolean>}
 */
export async function isGit() {

  let currentPath = process.cwd();
  while(currentPath!=='/') {
    if (await exists(path.join(currentPath,'.git'))) {
      return true;
    }
    currentPath = path.dirname(currentPath);
  }
  return false;

}

/**
 * @param {string} command
 * @returns {string}
 */
export function runCommand(command) {

  process.stderr.write(command + '\n');
  return execSync(command).toString('utf-8');

}
