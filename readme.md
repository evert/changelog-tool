Changelog tool
==============

This repository contains a simple tool for reading and manipulating changelog
files.

This tool currently expects to work with a file named 'changelog.md' in the
current working directory. This is a markdown file that looks like this:

```
Changelog
=========

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
npm install changelog-tool --global
```

CLI
---

To tool can be used programmatically and with the CLI. The CLI has the
following commands:

```
changelog init             - Create a new, empty npx changelog.
changelog add -m [message] - Adds a new line to the npx changelog.
changelog release          - Marks the current npx changelog as released.
changelog show             - Show the last npx changelog.
changelog show [version]   - Show the npx changelog of a specific version.
changelog list             - List all versions in the npx changelog.
changelog format           - Reformats the npx changelog in the standard format.
```

### 'add' command

The add comment lets you add a new message at the bottom of the last unreleased
version.

To use it, just run:

```
changelog add -m "Bug fix"
```

If there is no unreleased version, it will create a new section and increase
the version number.

If the current change should result in a new major or minor version number, you
can use the following arguments.

```
changelog add --minor -m "New feature"
changelog add --major -m "Backwards compatibility break"
```

These settings will automatically adjust the version string of the most recent
unreleased version.

### 'release' command

The release command will look for a recent unreleased version in the changelog
(where the date is marked `????-??-??`) and change it to the current date:

```
changelog release
```

If the tool detects a `package.json` file in the current directory, it will
also call:

```
npm version [version] --no-git-tag-version
```

This command adjust the `version` field in `package.json` to match the latest
changelog version.

If the tool detects if this is a git directory, it will also:

* Ensure that the working directory is clean.
* Commit the changes.
* Create a tag with `git tag v[version]`.
