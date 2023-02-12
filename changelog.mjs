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
      this.versions.map(version => version.toString()).join('\n\n') +
      '\n'
    );

  }

  /**
   * Adds a new Version log
   *
   * @param version {VersionLog}
   */
  add(version) {

    this.versions.push(version);

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
   */
  add(message) {
    this.items.push(new LogItem(message));
  }

  toString() {

    const title = this.version + ' (' + (this.date ?? '????-??-??') + ')';
    return (
      title + '\n' +
      ('-'.repeat(title.length)) + '\n' +
      (this.preface ? wrap(this.preface) + '\n' : '') +
      '\n' +
      this.items.map(version => version.toString()).join('\n') +
      '\n' +
      (this.postface ? wrap(this.postface) + '\n' : '')
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


