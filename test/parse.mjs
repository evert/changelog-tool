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
