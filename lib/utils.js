/**
 * @template const ItemType
 * @template {string | number} const IdType
 * @param {PropertyKey | ((i: ItemType) => IdType)} [getId]
 */
export function makeGetId(getId) {
	if (getId && typeof getId === 'function') return getId

	/**
	 * @param {ItemType} item
	 * @return {IdType}
	 */
	// @ts-expect-error
	return (item) => item[getId ?? 'id']
}
