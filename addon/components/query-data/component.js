import Component from '@ember/component';
import layout from './template';
import { parseQueryToFunction } from 'ember-data-utils/utils';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

/**
  A component to fetch data from your api

  ```handlebars
  {{query-data
    modelType='app-page-profile'
    sortBy=(array 'createdAt:desc')
    query=(hash pageId=@page.id)
    as |data|}}
    ...
  {{/query-data}}
  ```
  @class QueryData
  @yield {object} data
  @yield {boolean} data.isLoading
  @yield {boolean} data.isEmpty
  @yield {array} data.sortedModels The models returned by the api, sorted
  @yield {Action} data.refresh Action method to trigger the component to refresh the data
*/
export default Component.extend({
  layout,

  tagName: '',
  store: service(),

  /**
    The name of the ember data model, eg; 'user'
    @argument {string} modelType
    @required
  */
  modelType: null,

  /**
    The object of values to query against the server, eg: { admin: true, firstName: 'Bob' }
    @argument {object} query
    @required
  */
  query: null,

  /**
    Callback fired every time server response finished
    @argument {Function} onModelsLoaded
    @optional
  */
  onModelsLoaded() {},

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

  /**
    A live record array of all of the models in the store of that
    type. This array will be automatically filtered down by the
    filter function created from the query hash

    @computed liveRecordArray
    @type Array<Object>
    @private
    @readOnly
  */
  liveRecordArray: computed('modelType', function() {
    return this.store.peekAll(this.modelType);
  }),

  loadDataTask: task(function*() {
    yield this.store.query(this.modelType, this.query);
    if (this.onModelsLoaded) { this.onModelsLoaded(); }
  }).keepLatest(),

  /**
    @computed filteredModels
    @type Array<Object>
    @private
    @readOnly
  */
  filteredModels: computed('liveRecordArray.[]', 'query', 'isLoading', function() {
      let filterFn = this.buildFilterFunction(this.query);

      return this.liveRecordArray.filter(filterFn);
    }
  ),

  /**
    @method buildFilterFunction
    @param {object} query - Query hash passed into `query` method
    @return {Function}
    @private
  */
  buildFilterFunction(query) {
    let queryFunc = parseQueryToFunction(query);
    return function(record) {
      return queryFunc(record);
    };
  },

  actions: {
    /**
      @action refresh
      @public
      @return {Task} - An instance of an Ember Concurrency Task
    */
    refresh() {
      this.loadDataTask.perform();
    }
  }
});
