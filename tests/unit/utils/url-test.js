import { module, test } from 'qunit';
import { appendToQueryParam } from 'ember-data-utils/utils/url';

module('Unit | Utility | url', function() {

  test('appendToQueryParam()', function(assert) {
    assert.equal(
      appendToQueryParam(
        'https://www.test.com',
        'include',
        'profile'
      ),
      'https://www.test.com/?include=profile',
      'it adds a new query param'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=person',
        'include',
        'profile'
      ),
      'https://www.test.com/?include=person%2Cprofile',
      'it adds to an existing param'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?query=person',
        'include',
        'profile'
      ),
      'https://www.test.com/?query=person&include=profile',
      'it adds a new query param while leaving existing params alone'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com',
        'include',
        ['profile', 'pizza']
      ),
      'https://www.test.com/?include=profile%2Cpizza',
      'new params can be an array'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        ['profile', 'pizza']
      ),
      'https://www.test.com/?include=party%2Cprofile%2Cpizza',
      'array params are concatted with existing param values'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        'profile,pizza'
      ),
      'https://www.test.com/?include=party%2Cprofile%2Cpizza',
      'params that are strings are added'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        null
      ),
      'https://www.test.com/?include=party',
      'null params are ignored'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        []
      ),
      'https://www.test.com/?include=party',
      'empty arrays are ignored'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        ['party']
      ),
      'https://www.test.com/?include=party',
      'param values are not duplicated'
    );
    assert.equal(
      appendToQueryParam(
        'https://www.test.com?include=party',
        'include',
        'party,pizza'
      ),
      'https://www.test.com/?include=party%2Cpizza',
      'param values are not duplicated even if a string'
    );
  });
});
