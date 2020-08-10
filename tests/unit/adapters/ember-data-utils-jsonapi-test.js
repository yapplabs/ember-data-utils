import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

let adapter;

module('Unit | Adapter | ember-data-utils-jsonapi', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function(){
    adapter = this.owner.lookup('adapter:ember-data-utils-json-api');
    adapter.include = ['image']
  });

  module('#buildQuery', function(){
    test('When only adapter have include present', async function(assert){
      assert.deepEqual(adapter.buildQuery({}), { include: 'image' });
    });
    test('When only snapshot has includes', async function(assert){
      adapter.include = [];
      assert.deepEqual(adapter.buildQuery({ include: 'author.image' }), { include: 'author.image' });
    });

    test('When both have unique includes', async function(assert){
      assert.deepEqual(adapter.buildQuery({ include: 'author.image' }), { include: 'author.image,image' });
    });

    test('When snapshot has same include as adapter', async function(assert){
      assert.deepEqual(adapter.buildQuery({ include: 'image' }), { include: 'image' });
    });

    test('When snapshot has same include as adapter and a new unique one', async function(assert){
      assert.deepEqual(adapter.buildQuery({ include: 'author.image,image' }), { include: 'author.image,image' });
    });
  })

  module('#query', function(){
    skip('with pagination');
    skip('with filters');
    skip('with includes');
    skip('with sort');
  })
});
