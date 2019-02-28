/**
 * Ember-data complains about relationships set as async: false
 * but that come with a payload for related links. Why? I don't know
 * This is a very aggresive method that simply deletes the related
 * key before it's pushed to the store.
 *
 * See: https://discuss.emberjs.com/t/ember-data-jsonapi-and-known-to-be-empty-relationships-that-are-definitely-not-empty/16219
 * 
 * @private
 * @method cleanupLinks
 * @param {EmberDataModel} modelClass the ember-data model class
 * @param {object} resourceHash 
 */
export default function cleanupLinks(modelClass, relationshipHash) {
  for (let relationshipName in relationshipHash) {
    let { links } = relationshipHash[relationshipName];

    if (links && isRelationshipSync(modelClass, relationshipName)) {
      delete relationshipHash[relationshipName].links;
    }
  }

  return relationshipHash;
}

/**
 * @public
 * @method _hasLinks
 * @param {object} relationships 
 */
export function hasLinks(relationships) {
  return Object.entries(relationships).some(rel => rel[1].links);
}

/**
 * @public
 * @method _isRelationshipSync
 * @param {EmberDataModel} modelClass the ember-data model class
 * @param {string} relationshipName 
 */
export function isRelationshipSync(modelClass, relationshipName) {
  let relationship = modelClass.relationshipsByName.get(relationshipName);

  return !relationship.options.async;
}