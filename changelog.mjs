import { calculateNextVersion, wrap } from './util.mjs';

// @ts-check
export class Changelog {

  title = 'Changelog';

  /**
   * @type {VersionLog[]}
   */
  versions = [];

  /**
   * @type {Link[]}
   */
  links = [];

  toString() {

    return (
      this.title + '\n' +
      ('='.repeat(this.title.length)) + '\n' +
      '\n' +
      this.versions.map(version => version.toString()).join('\n\n') +

      // Sorry about this line future me (or someone else)
      (this.links.length > 0 ? ('\n' + this.links.map( link => wrap(`[${link.name}]: ${link.href}${link.title?` "${link.title}"`:''}`, link.name.length+4)).join('\n') + '\n') : '')
    );

  }

  /**
   * Adds a new Version log
   *
   * @param version {VersionLog}
   * @returns {VersionLog}
   */
  add(version) {

    this.versions = [version, ...this.versions];
    return version;

  }

  /**
   * Adds a new version to the log. Version string is automatically increased
   * from the previous one
   *
   * @param {'patch'|'minor'|'major'} changeType
   * @returns {VersionLog}
   */
  newVersion(changeType = 'patch') {

    const lastVersion = this.versions[0].version;
    const newVersion = calculateNextVersion(lastVersion, changeType);
    const versionLog = new VersionLog(newVersion);

    return this.add(versionLog);

  }

  /**
   * Finds a VersionLog by its version string
   *
   * @param {string} version
   * @returns {VersionLog}
   */
  get(version) {

    const log = this.versions.find( myLog => myLog.version === version);
    if (!log) {
      throw new Error(`Couldn't find version ${version} in the changelog`);
    }
    return log;

  }

}

export class VersionLog {

  /**
   * @type {string}
   */
  version;

  /**
   * @type {string|null}
   */
  date = null;

  /**
   * @type {string|null}
   */
  preface = null;

  /**
   * @type {string|null}
   */
  postface = null;

  /**
   * @type {LogItem[]}
   */
  items = [];

  /**
   * @param {string} version
   */
  constructor(version) {
    this.version = version;

  }

  /**
   * @param {string} message
   * @returns {LogItem}
   */
  add(message) {
    const item = new LogItem(message);
    this.items.push(item);
    return item;
  }

  toString() {

    return this.output();

  }

  /**
   * Renders the changelog as a string.
   *
   * @param {boolean} lineWrap
   * @returns {string}
   */
  output(lineWrap = true) {

    const lineLength = lineWrap ? 79 : Infinity;
    const title = this.version + ' (' + (this.date ?? '????-??-??') + ')';
    return (
      title + '\n' +
      ('-'.repeat(title.length)) + '\n' +
      (this.preface ? '\n' + wrap(this.preface, 0, lineLength) + '\n' : '') +
      '\n' +
      this.items.map(version => version.output(lineWrap)).join('\n') +
      '\n' +
      (this.postface ? '\n' + wrap(this.postface, 0, lineLength) + '\n' : '')
    );

  }

}

export class LogItem {

  /**
   * @type {string}
   */
  message;

  /**
   * @param {string} message
   */
  constructor(message) {
    this.message = message;
  }

  /**
   * Renders the changelog as a string.
   *
   * @param {boolean} lineWrap
   * @returns {string}
   */
  output(lineWrap = true) {
    const lineLength = lineWrap ? 79 : Infinity;
    return wrap('* ' + this.message, 2, lineLength);
  }

  toString() {

    return wrap('* ' + this.message, 2);

  }

}

/**
 * @typedef Link {Object}
 * @property Link.href {string}
 * @property Link.name {string}
 * @property Link.title {string|null}
 */
