// @ts-check
import { test } from 'node:test';
import { parse } from '../parse.mjs';
import * as assert from 'node:assert';

test('Parsing changelog metadata', async () => {

  const input = `Time for a change
=========

0.2.0 (????-??-??)
------------------

* Implemented the 'list' command.
* Added testing framework.

0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands.
*
`;

  const result = await parse(input);

  assert.equal('Time for a change', result.title);
  assert.equal(2, result.versions.length);
  
  assert.equal(null, result.versions[0].date);
  assert.equal('0.2.0', result.versions[0].version);
  assert.equal('2023-02-08', result.versions[1].date);
  assert.equal('0.1.0', result.versions[1].version);

});

test('Parsing changelog entries', async () => {

  const input = `Time for a change
=========

0.2.0 (????-??-??)
------------------

* Implemented the 'list' command.
* Added testing framework.

0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands.
*
`;

  const result = await parse(input);

  const latest = result.get('0.2.0');
  assert.equal(2, latest.items.length);
  assert.equal('Implemented the \'list\' command.', latest.items[0].message);


});

test('Preface and postface', async () => {

  const input = `Time for a change
=========

0.2.0 (????-??-??)
------------------

WOW another release. How good is that?
Here's another line.

* Implemented the 'list' command.
* Added testing framework.

Well, that's all folks.

0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands.
*
`;

  const result = await parse(input);

  const latest = result.get('0.2.0');

  assert.equal('WOW another release. How good is that? Here\'s another line.', latest.preface);
  assert.equal('Well, that\'s all folks.', latest.postface);


});

test('Link references', async() => {


  const input = `Changesss
=========

0.2.0 (????-??-??)
------------------

WOW another release. How good is that?
Here's another line.

* Implemented the 'list' command.
* Added testing framework. See [the blog post][1] for more information.

0.1.0 (2023-02-08)
------------------

* Implemented the ['help'][2] and 'init' commands.

[1]: https://evertpot.com/ "My Blog"
[2]: https://indieweb.social/@evert "My Mastodon account, but it's split
  over two lines"
`;

  debugger;
  const result = await parse(input);

  assert.deepEqual({
    name: '1',
    href: 'https://evertpot.com/',
    title: 'My Blog',
  }, result.links[0]);
  assert.deepEqual({
    name: '2',
    href: 'https://indieweb.social/@evert',
    title: 'My Mastodon account, but it\'s split over two lines',
  }, result.links[1]);

});
