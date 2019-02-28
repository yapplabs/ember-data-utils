/**
 * Ember-data complains about relationships set as async: false
 * but that come with a payload for related links. Why? I don't know
 * This is a very aggresive method that simply deletes the related
 * key before it's pushed to the store.
 *
 * See: https://discuss.emberjs.com/t/ember-data-jsonapi-and-known-to-be-empty-relationships-that-are-definitely-not-empty/16219
 * 
 * @function cleanupLinksForSyncRelationships
 * @export default
 * @param {EmberDataModel} modelClass the ember-data model class
 * @param {object} relationshipsHash 
 * @return {object} the relationshipsHash with link keys removed
 */
export default function cleanupLinksForSyncRelationships(modelClass, relationshipHash) {
  for (let relationshipName in relationshipHash) {
    let { links } = relationshipHash[relationshipName];

    if (links && isRelationshipSync(modelClass, relationshipName)) {
      delete relationshipHash[relationshipName].links;
    }
  }

  return relationshipHash;
}

/**
 * @function hasLinks
 * @export named
 * @param {object} relationships 
 */
export function hasLinks(relationships) {
  return Object.entries(relationships).some(rel => rel[1].links);
}

/**
 * @function isRelationshipSync
 * @export named
 * @param {EmberDataModel} modelClass the ember-data model class
 * @param {string} relationshipName 
 */
export function isRelationshipSync(modelClass, relationshipName) {
  let relationship = modelClass.relationshipsByName.get(relationshipName);

  if (relationship.options.async === undefined) {
    return false; // Relationships default to async
  }

  return !relationship.options.async;
}