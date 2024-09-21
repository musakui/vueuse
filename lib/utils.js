/**
 * @param {unknown} val
 * @returns {val is import('./types').Comparable}
 */
export function isComparable(val) {
	if (Number.isNaN(val)) return false
	if (val instanceof Date) return !isNaN(val.getTime())
	const s = typeof val
	return s === 'number' || s === 'string' || s === 'bigint' || s === 'boolean'
}

/**
 * @template const ItemType
 * @template ValType
 * @param {string | keyof ItemType | ((i: ItemType) => ValType)} prop
 * @returns {(i: ItemType) => ValType}
 */
export function makeGetValue(prop) {
	if (typeof prop === 'function') return prop

	if (
		typeof prop === 'number' ||
		typeof prop === 'symbol' ||
		prop.indexOf('.') < 0
	) {
		// @ts-expect-error
		return (c) => c[prop]
	}

	const path = prop.split('.')
	// @ts-expect-error
	return (c) => path.reduce((obj, key) => obj?.[key], c)
}

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
