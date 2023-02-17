Changelog
=========

0.7.2 (????-??-??)
------------------

* Added a `--nowrap` option to `show`, which doesn't wrap long lines. This is
  useful for copy-pasting changelog into places where linebreaks are
  significant, such as the Github releases section.
* Support multiple digits for the alpha/beta release string.


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

* Implemented the 'help' and 'init' commands.
