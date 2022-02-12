import Component from '@glimmer/component';
import { parseQueryToFunction } from 'ember-data-utils/utils';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

/**
  A component to fetch data from your api

    @argument {string} modelType
    @description The name of the ember data model, eg; 'user'
    @required
    modelType;

    @argument {object} query
    @description The object of values to query against the server, eg: { admin: true, firstName: 'Bob' }
    @required
    query = null;
  
    @description Callback fired every time server response finished
    @argument {Function} onModelsLoaded
    @optional
    onModelsLoaded()
  
  ```handlebars
  <QueryData
    @modelType='app-page-profile'
    @sortBy={{array 'createdAt:desc'}}
    @query={{hash pageId=@page.id}}
    as |data|>
    ...
  </QueryData>
  ```
  @class QueryData
  @yield {object} data
  @yield {boolean} data.isLoading
  @yield {boolean} data.isEmpty
  @yield {array} data.sortedModels The models returned by the api, sorted
  @yield {Action} data.refresh Action method to trigger the component to refresh the data
*/
export default class extends Component {
  @service store;
  
  didQueryUpdate() {
    let newQuery = this.args.query;
    if (this._oldQuery === newQuery) {
      return;
    }
    this.loadDataTask.perform();
    this._oldQuery = newQuery;
  }

  get sortedModels() {
    return this.filteredModels.sortBy('sortBy');
  }

  /**
    A live record array of all of the models in the store of that
    type. This array will be automatically filtered down by the
    filter function created from the query hash

    @property liveRecordArray
    @type Array<Object>
    @private
    @readOnly
  */
  get liveRecordArray() {
    return this.store.peekAll(this.args.modelType);
  }

  @task({ keepLatest: true })
  *loadDataTask() {
    yield this.store.query(this.args.modelType, this.args.query);
    if (this.onModelsLoaded) { this.onModelsLoaded(); }
  }

  /**
    @property filteredModels
    @type Array<Object>
    @private
    @readOnly
  */
  get filteredModels() {
    let filterFn = this.buildFilterFunction(this.args.query);

    return this.liveRecordArray.filter(filterFn);
  }

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
  }

    /**
      @action refresh
      @public
      @return {Task} - An instance of an Ember Concurrency Task
    */
    refresh() {
      this.loadDataTask.perform();
    }
}
