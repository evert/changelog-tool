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

const linkReferenceRe = /^\[([a-zA-Z0-9]+)\]:/;
const versionRe = /^([0-9\.]{3,}(?:-(?:alpha|beta)\.[0-9]+)?) \(([0-9]{4}-[0-9]{2}-[0-9]{2}|\?\?\?\?-\?\?-\?\?)\)$/;


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

  let lastVersionLog = null;
  let lastBullet = null;

  for(let idx=2; idx<lines.length; idx++) {

    const line = lines[idx];

    if (line.startsWith('* ')) {
      // Found a bullet point
      if (!lastVersionLog) {
        throw new Error(`Parse error: found a bullet point * outside of a level 2 heading on line ${idx+1}`);
      }
      lastBullet = lastVersionLog.add(line.substr(1).trim());
      continue;
    }
    if (line.startsWith('  ')) {
      // Continuation of last line.
      if (!lastBullet) {
        throw new Error(`Parse error: unexpected indented string on line ${line+1}`);
      }
      lastBullet.message += ' ' + line.trim();
      continue;
    }

    // Look for link references
    if (linkReferenceRe.test(line)) {

      let linkRefLine = line;
      while(lines[idx+1]?.match(/^\W\W/)) {
        // If the line was folded over multiple lines, read those too.
        linkRefLine += ' ' + lines[idx+1].trim();
        idx++;
      }
      const name = linkRefLine.match(linkReferenceRe)?.[1];
      const href = linkRefLine.split(' ')[1];
      const title = linkRefLine.includes('"') ? linkRefLine.substring(linkRefLine.indexOf('"')+1,linkRefLine.lastIndexOf('"')) : null;
      changelog.links.push({
        name: /** @type {string} */(name),
        href,
        title
      });
      continue;

    }

    // Look to the next line for ----
    if (lines[idx+1]?.match(/^-{1,}$/)) {
      // Found a new Version
      const matches = line.match(versionRe);

      if (!matches) {
        throw new Error(`A version title must have the format "1.0.0 (YYYY-MM-DD)" or "1.0.0 (????-??-??)" for unreleased versions. We found: "${line}"`);
      }

      const versionLog = new VersionLog(matches[1]);
      if (matches[2] === '????-??-??') {
        versionLog.date = null;
      } else {
        versionLog.date = matches[2];
      }
      changelog.versions.push(versionLog);
      lastVersionLog = versionLog;
      lastBullet = null;
      idx++;
      continue;

    }

    if (line.trim()==='') {
      continue;
    }

    if (!lastVersionLog) {
      throw new Error(`Parse error: unexpected string on line ${line+1}`);
    }
    // If we got here, this is either a loose preface or postface line.
    if (lastBullet) {
      lastVersionLog.postface = lastVersionLog.postface ? lastVersionLog.postface + ' ' + line : line;
    } else {
      lastVersionLog.preface = lastVersionLog.preface ? lastVersionLog.preface + ' ' + line : line;
    }


  }

  return changelog;


}
