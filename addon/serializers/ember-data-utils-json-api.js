import { JSONAPISerializer } from '@ember/data';
import { cleanupLinksForSyncRelationships, hasLinks } from 'ember-data-utils/utils'

/**
  Class to set as your ApplicationSerializer.
  
  ```js
  // app/serializers/application.js
  import { EmberDataUtilsJSONAPISerializer } from 'ember-data-utils';

  export default EmberDataUtilsJSONAPISerializer.extend({});
  ```

  @class EmberDataUtilsJSONAPISerializer
 */
export class EmberDataUtilsJSONAPISerializer extends JSONAPISerializer {
  /**
   * @public
   * @method extractRelationships
   * @param {EmberDataModel} modelClass the ember-data model class
   * @param {object} resourceHash 
   */
  extractRelationships(modelClass, resourceHash) {
    let relationships = super.extractRelationships(modelClass, resourceHash);
    if (hasLinks(relationships)) {
      relationships = cleanupLinksForSyncRelationships(modelClass, relationships);
    }
    return relationships;
  }
}