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

CLI
---

To tool can be used programmatically and with the CLI. The CLI has the
following commands:

```
changelog init           - Create a new, empty changelog.
changelog add [message]  - Adds a new line to the changelog.
changelog release        - Marks the current changelog as released.
changelog show           - Show the last changelog.
changelog show [version] - Show the changelog of a specific version.
changelog list           - List all versions in the changelog.
changelog format         - Reformats the changelog in the standard format.
```

Feature requests and bug reports are welcome.
