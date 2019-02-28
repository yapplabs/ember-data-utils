import DS from 'ember-data';
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
export default DS.JSONAPISerializer.extend({
  /**
   * @public
   * @method extractRelationships
   * @param {EmberDataModel} modelClass the ember-data model class
   * @param {object} resourceHash 
   */
  extractRelationships(modelClass, resourceHash) {
    let relationships = this._super(modelClass, resourceHash);
    if (hasLinks(relationships)) {
      relationships = cleanupLinksForSyncRelationships(modelClass, relationships);
    }
    return relationships;
  },

});
