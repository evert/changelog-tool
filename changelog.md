Changelog
=========

1.2.1 (2025-05-26)
------------------

* New --force flag was being ignored.


1.2.0 (2025-05-12)
------------------

* Added `--force` flag, which ignores errors when calling changelog release.

Note: v1.1.0 was skipped. A few years ago this version was accidentally
published on NPM so we need to skip it.


1.0.1 (2023-06-30)
------------------

* Fix bug in parsing link references with more than 1 character


1.0.0 (2023-06-20)
------------------

First stable release! Just kidding, it was already stable.

* Add support for [Markdown reference links][1]. References are a Markdown
  feature that lets you write links in paragraphs, but put the actual target
  near the end of the document similar to references in technical documents.
  This can declutter the reading experience for those reading the Markdown
  sources. The tool doesn't let you quickly add links via the CLI yet, but it
  will no longer mangle them when they appear.
* Testing Node 20
* Bugfix: Always insert an empty line between the 'preface' and bulletpoints
  sections of a version block.


0.7.2 (2023-02-17)
------------------

* Added a `--nowrap` option to `show`, which doesn't wrap long lines. This is
  useful for copy-pasting changelog into places where linebreaks are
  significant, such as the Github releases section.
* Support multiple digits for the alpha/beta release string.
* Also allows setting the changelog message as positional arguments.


0.7.1 (2023-02-14)
------------------

* Bug: forgot to commit the release


0.7.0 (2023-02-14)
------------------

* The "release" command now automatically commits and and creates a git tag,
  much like `npm version`


0.6.0 (2023-02-14)
------------------

* The release command now automatically calls "npm version" if a package.json
  was found in the project directory
* Bug fix: the --major and --minor arguments were ignored when using "add" to
  create a new version log


0.5.0 (2023-02-12)
------------------

* Support changing the version to the next major/minor using the `--major` and
  `--minor` arguments.
* The `add` command now uses the -m argument instead of a positional for the
  message.


0.4.1 (2023-02-12)
------------------

* Make sure that the binary is executable


0.4.0 (2023-02-12)
------------------

* Implemented the "format", "parse" and "release" commands.


0.3.0 (2023-02-12)
------------------

* Implemented the 'show' command.


0.2.0 (2023-02-12)
------------------

* Implemented the 'list' command.
* Added testing framework based on node:test.


0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands

[1]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#link
     "Markdown cheatsheet: Links"
