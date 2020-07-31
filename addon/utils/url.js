import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';

/**
 * @function appendToQueryParam
 * @export named
 * @param {string} url
 */
export function appendToQueryParam(urlString, param, newValue) {
  let url = new URL(urlString);
  if (isEmpty(newValue)) {
    return url.href;
  }

  let existingParamValue = url.searchParams.get(param);
  let existingValues = existingParamValue ? existingParamValue.split(',') : [];
  newValue = isArray(newValue) ? newValue : newValue.split(',');
  // Merge the two arrays, filtering out empty values
  existingValues = existingValues.concat(newValue).filter(Boolean);
  // Remove duplicate content
  existingValues = [...new Set(existingValues)]
  url.searchParams.set(param, existingValues.join(','));

  return url.href;
}
