Changelog tool
==============

This repository contains a simple tool for reading and manipulating changelog
files.

This tool currently expects to work with a file named 'changelog.md' in the
current working directory. This is a markdown file that looks like this:

```
0.4.0 (????-??-??)
------------------

* Feature A
* Bugfix 3

0.3.0 (2023-02-08)
------------------

* First public release!
```

Questionmarks for the date indicate an unreleased version.

Installation
------------

```sh
npm install changelog-tool --save-dev
```

CLI
---

To tool can be used programmatically and with the CLI. The CLI has the
following commands:

```
npx changelog init             - Create a new, empty npx changelog.
npx changelog add -m [message] - Adds a new line to the npx changelog.
npx changelog release          - Marks the current npx changelog as released.
npx changelog show             - Show the last npx changelog.
npx changelog show [version]   - Show the npx changelog of a specific version.
npx changelog list             - List all versions in the npx changelog.
npx changelog format           - Reformats the npx changelog in the standard format.
```

### Invoking add

Easiest is to just run:

```
npx changelog add -m "Bug fix"
```

This will automatically add a line to the latest unreleased version. If there
is no unreleased version, it will create a new patch version.

If the change should cause a minor or major version bump, you can specify the
these options too:

```
npx changelog add --minor -m "New feature"
npx changelog add --major -m "Backwards compatibility break"
```

These settings will automatically adjust the version string of the most recent
unreleased version.
