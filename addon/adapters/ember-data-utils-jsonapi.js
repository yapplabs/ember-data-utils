import DS from 'ember-data';
import { camelize } from '@ember/string';
import { isEmpty } from '@ember/utils';

export default DS.JSONAPIAdapter.extend({
  supportedFilters: [], // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
  include: [], // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
  
  query(store, type, query) {
    let jsonApiQuery = {};
    jsonApiQuery = this._applyPagination(jsonApiQuery, query);
    jsonApiQuery = this._applySupportedFilters(jsonApiQuery, query);
    jsonApiQuery = this._applyIncludes(jsonApiQuery);

    return this._super(store, type, jsonApiQuery);
  },

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
