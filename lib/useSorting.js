import { ref, computed, toValue } from 'vue'
import { isComparable, makeGetValue } from './utils.js'

/**
 * reactive sorting for given columns
 *
 * @template const ItemType
 * @template {string} const ColKey
 * @param {import('vue').MaybeRef<import('./types').ColumnDefinition<ItemType, ColKey>[]>} columns
 */
export function useSorting(columns) {
	const sorters = computed(() => {
		/** @type {Map<ColKey, import('./types').Comparator<ItemType>>} */
		const st = new Map()

		const cols = toValue(columns) ?? []
		for (const col of cols) {
			if (!col.key) continue
			if (typeof col.cmp === 'function') {
				st.set(col.key, col.cmp)
				continue
			}
			const nl = col.nulls?.toLowerCase() ?? 'last'
			const np = nl === 'first' ? 1 : nl === 'last' ? -1 : 0
			const nv = nl === 'small' ? 1 : nl === 'large' ? -1 : 0
			const fn = makeGetValue(col.sortBy ?? col.key)
			st.set(col.key, (a, b, dir) => {
				const va = fn(a)
				const vb = fn(b)
				if (isComparable(va) && isComparable(vb)) {
					return va > vb ? dir : va < vb ? -dir : 0
				}
				return (va ? 1 : vb ? -1 : 0) * (dir * nv || np)
			})
		}

		return st
	})

	/** @type {import('vue').Ref<{ key: ColKey, dir: number }[]>} */
	const state = ref([])

	const sortingState = computed({
		get() {
			return /** @type {Record<ColKey, number>} */ (
				Object.fromEntries(state.value.map((v) => [v.key, v.dir]))
			)
		},
		set(v) {
			const vals = /** @type {[ColKey, number][]} */ (Object.entries(v))
			const st = sorters.value
			state.value = vals
				.filter((s) => s[1] && st.has(s[0]))
				.map(([key, dir]) => ({ key, dir }))
		},
	})

	const comparator = computed(() => {
		if (!state.value.length) return null
		const st = sorters.value
		/** @type {(a: ItemType, b: ItemType) => number} */
		return (a, b) => {
			for (const { key, dir } of state.value) {
				if (!dir) continue
				const cmp = st.get(key)
				if (!cmp) continue
				const v = cmp(a, b, dir)
				if (v) return v
			}
			return 0
		}
	})

	/** @param {ColKey} key */
	const withoutKey = (key) => state.value.filter((s) => s.key !== key)

	/**
	 * @param {ColKey} key
	 * @returns {key is ColKey}
	 */
	const validKey = (key) => sorters.value.has(key)

	return {
		/** combined comparator function */
		comparator,
		/** state of sorters as an object */
		sortingState,
		/** state of sorters as an array */
		sortingArray: state,
		/**
		 * set the sorting state (overwrites current state)
		 * @param {ColKey} key
		 * @param {number} [dir]
		 */
		set(key, dir) {
			if (!validKey(key)) return
			state.value = !dir || typeof dir !== 'number' ? [] : [{ key, dir }]
		},
		/**
		 * add a key to the current sorting state
		 * @param {ColKey} key
		 * @param {number} dir
		 */
		add(key, dir) {
			if (!validKey(key)) return
			if (!dir || typeof dir !== 'number') return
			state.value = [...withoutKey(key), { key, dir }]
		},
		/**
		 * remove a key from the current sorting state
		 * @param {ColKey} key
		 */
		remove(key) {
			if (!validKey(key)) return
			state.value = withoutKey(key)
		},
		/**
		 * toggle sort for a key
		 * @param {ColKey} key
		 */
		toggle(key) {
			if (!validKey(key)) return
			const idx = state.value.findIndex((s) => s.key === key)
			if (idx < 0) {
				state.value.push({ key, dir: 1 })
				return
			}
			const dir = state.value[idx].dir
			if (!dir) {
				state.value[idx].dir = 1
			} else if (dir > 0) {
				state.value[idx].dir = -1
			} else {
				state.value = withoutKey(key)
			}
		},
	}
}
