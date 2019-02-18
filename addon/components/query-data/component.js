/** @documenter esdoc */

import Component from '@ember/component';
import layout from './template';
import { parseQueryToFunction } from 'ember-data-utils/utils/parse-query-to-function';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

/**
   A component to fetch data from your api

   ```handlebars
    <QueryData
      @modelType='app-page-profile'
      @sortBy={{array 'createdAt:desc'}}
      @query={{hash pageId=@page.id}}
    as |data|>
        ...
    </QueryData>
    ```
    @argument {string} modelType - name of the ember data model
    @argument {array} sortBy - Array of keys to sort by
    @argument {object} query - Object of values to query against the server
    @argument {function} onModelsLoaded - Callback that is fired when models are loaded

    @yield {object} data
    @yield {boolean} data.isLoading
    @yield {boolean} data.isEmpty
    @yield {array} data.sortedModels - The models returned by the api, sorted
    @yield {Action} data.refresh - Action method to trigger the component to refresh the data
*/
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

  filteredModels: computed('liveRecordArray.[]', 'query', 'isLoading', function() {
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
