import Component from '@ember/component';
import layout from './template';
import { parseQueryToFunction } from 'ember-data-utils/utils/parse-query-to-function';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  tagName: '',
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);

    let newQuery = this.query;
    if (this._oldQuery === newQuery) {
      return;
    }
    this.loadDataTask.perform();
    this._oldQuery = newQuery;
  },

  sortedModels: sort('filteredModels', 'sortBy'),

  liveRecordArray: computed('modelType', function() {
    return this.store.peekAll(this.modelType);
  }),

  loadDataTask: task(function*() {
    yield this.store.query(this.modelType, this.query);
    if (this.onModelsLoaded) { this.onModelsLoaded(); }
  }).keepLatest(),

  filteredModels: computed( 'liveRecordArray.[]', 'query', 'isLoading', function() {
      let filterFn = this.buildFilterFunction(this.query);

      return this.liveRecordArray.filter(filterFn);
    }
  ),

  buildFilterFunction(query) {
    let queryFunc = parseQueryToFunction(query);
    return function(record) {
      return queryFunc(record);
    };
  },

  actions: {
    refresh() {
      this.loadDataTask.perform();
    }
  }
});
