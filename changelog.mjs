import { wrap } from './util.mjs';

// @ts-check
export class Changelog {

  title = 'Changelog';

  /**
   * @type {VersionLog[]}
   */
  versions = [];

  toString() {

    return (
      this.title + '\n' +
      ('='.repeat(this.title.length)) + '\n' +
      '\n' +
      this.versions.map(version => version.toString()).join('\n\n')
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
   * @returns {VersionLog}
   */
  newVersion() {

    const lastVersionStr = this.versions[0].version;
    const lastVersionParts = lastVersionStr.split('.');
    if (!lastVersionParts.at(-1)?.match(/^[0-9]+$/)) {
      throw new Error(`Could not automatically determine the next version string after "${lastVersionStr}"`);
    }
    const newVersionStr = [
      ...lastVersionParts.slice(0, -1),
      // @ts-ignore-error 'Possibly udefined', but we know it isnt
      parseInt(lastVersionParts.at(-1)) + 1
    ].join('.');
    const versionLog = new VersionLog(newVersionStr);

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

    const title = this.version + ' (' + (this.date ?? '????-??-??') + ')';
    return (
      title + '\n' +
      ('-'.repeat(title.length)) + '\n' +
      (this.preface ? '\n' + wrap(this.preface) : '') +
      '\n' +
      this.items.map(version => version.toString()).join('\n') +
      '\n' +
      (this.postface ? '\n' + wrap(this.postface) + '\n' : '')
    );

  }

}

export class LogItem {

  /**
   * @type string
   */
  message;

  /**
   * @param {string} message
   */
  constructor(message) {
    this.message = message;
  }

  toString() {

    return wrap('* ' + this.message, 2);

  }

}


