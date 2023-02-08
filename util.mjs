// @ts-check
import * as fs from 'node:fs/promises';

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
export function wrap(input, secondLineOffset = 0, lineLength = 80) {

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
