/* globals Reflect */
import { get } from '@ember/object';

/**
  @method parseQueryToFunction
  @param {object} query - Object to filter an array by
  @return {Function} Function to pass to filter method
*/
export default function parseQueryToFunction(query) {
  let properties = Object.keys(query).reject(function(key) {
    if (Reflect) {
      return !Reflect.has(query, key) || /^_/.test(key) || key === 'meta';
    } else {
      return !query.hasOwnProperty(key) || /^_/.test(key) || key === 'meta';
    }
  });

  // super naive truthy only filtering
  return function(record) {
    let property;

    for (let i = 0; i < properties.length; i++) {
      property = properties[i];

      if (get(record, property) !== query[property]) {
        return false;
      }
    }

    return true;
  };
}
