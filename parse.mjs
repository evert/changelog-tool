// @ts-check
import { Changelog, VersionLog } from "./changelog.mjs";
import { readFile } from 'node:fs/promises';

/**
 * @param {string} filename
 * @returns {Promise<Changelog>}
 */
export async function parseFile(filename) {

  return parse(
    await readFile(filename, 'utf-8')
  );

}

/**
 * @param {string} changelogInput
 * @returns {Changelog}
 */
export function parse(changelogInput) {

  const lines = changelogInput.split('\n');
  if (!lines[1].match(/^={1,}$/)) {
    throw new Error('Parse error: Line 1 and 2 of the changelog must be in the format "Changelog\\n=====". We did not find all equals signs on the second line.');
  }
  const changelog = new Changelog();
  changelog.title = lines[0];

  for(let idx=2; idx<lines.length; idx++) {

    if (lines[idx+1]?.match(/^-{1,}$/)) {
      // Found a new Version
      const versionTitle = lines[idx];
      const matches = versionTitle.match(/^([0-9\.]{3,}(?:-(?:alpha|beta)\.[0-9])?) \(([0-9]{4}-[0-9]{2}-[0-9]{2}|\?\?\?\?-\?\?-\?\?)\)$/);

      if (!matches) {
        throw new Error(`A version title must have the format "1.0.0 (YYYY-MM-DD)" or "1.0.0 (????-??-??)" for unreleased versions. We found: "${lines[idx]}"`);
      }

      const versionLog = new VersionLog(matches[1]);
      if (matches[2] === '????-??-??') {
        versionLog.date = null;
      } else {
        versionLog.date = matches[2];
      }
      changelog.add(versionLog);

    }

  }

  return changelog;


}
