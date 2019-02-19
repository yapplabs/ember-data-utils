import DS from 'ember-data';
import { camelize } from '@ember/string';
import { isEmpty } from '@ember/utils';

/**
  Class to set as your ApplicationAdapter. Extend it for each model 
  you want to configure explicit filter and include params. 
  
  ```js
  // app/adapters/application.js
  import { EmberDataUtilsJSONAPIAdapter } from 'ember-data-utils';

  export default EmberDataUtilsJSONAPIAdapter.extend({});
  ```

  ```js
  // app/adapters/post.js
  import BaseAdapter from './application';

  export default BaseAdapter.extend({
    supportedFilters: ['page-id'],
    include: ['image', 'profile.image']
  })
  ```
  @class EmberDataUtilsJSONAPIAdapter
 */
export default DS.JSONAPIAdapter.extend({
  /**
    List of query param keys that your resource supports filtering on. 
    Extend your base class for specific models to declare. 
    @field {Array} supportedFilters
   */
  supportedFilters: [], // eslint-disable-line ember/avoid-leaking-state-in-ember-objects

  /**
    List of includes to always include when querying a particular model.
    Extend your base class for specific models to declare. 
    
    @field {Array} include
   */
  include: [], // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
  
  /**
   * @public
   * @method query
   * @param {Store} store Instance of your ember data store
   * @param {string} type A string of the name of your model, eg 'post'
   * @param {object} query Hash to mutate into JSONAPI query params
   */
  query(store, type, query) {
    let jsonApiQuery = {};
    jsonApiQuery = this._applyPagination(jsonApiQuery, query);
    jsonApiQuery = this._applySupportedFilters(jsonApiQuery, query);
    jsonApiQuery = this._applyIncludes(jsonApiQuery);

    return this._super(store, type, jsonApiQuery);
  },

  /**
   * Mutate the `jsonApiQueryParams` object with pagination related keys from `rawQueryParams` object
   * 
   * Pagination related keys are `limit`, `since`, and `until`
   * 
   * @private
   * @method _applyPagination
   * @param {Object} jsonApiQueryParams Object of JSONAPI formated query params
   * @param {Object} rawQueryParams Original, unformated Object of query params
   * @return {Object} Mutated jsonApiQueryParams object with pagination params applied 
   */
  _applyPagination(jsonApiQueryParams, rawQueryParams) {
    ['limit', 'since', 'until'].forEach(key => {
      let value = rawQueryParams[`_${key}`];
      if (value) {
        jsonApiQueryParams[`page[${key}]`] = value;
      }
    });
    return jsonApiQueryParams;
  },

  _applySupportedFilters(jsonApiQueryParams, rawQueryParams) {
    this.supportedFilters.forEach(key => {
      let value = rawQueryParams[camelize(key)];
      if (value) {
        jsonApiQueryParams[`filter[${key}]`] = value;
      }
    });

    return jsonApiQueryParams;
  },

  _applyIncludes(jsonApiQueryParams) {
    if (!isEmpty(this.include)) {
      jsonApiQueryParams.include = this.include.join(',');
    }
    return jsonApiQueryParams;
  }
});
