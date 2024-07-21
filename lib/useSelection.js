import { ref, computed, toValue } from 'vue'
import { makeGetId } from './utils.js'

const SEL_NONE = 0
const SEL_SOME = 1
const SEL_ALL = 2

/**
 * reactive selection for an array of items
 *
 * @template const ItemType
 * @template {string | number} const IdType
 * @param {import('vue').MaybeRef<ItemType[]>} items
 * @param {import('./types').SelectionOpts<ItemType, IdType>} opts
 */
export function useSelection(items, opts = {}) {
	/** @type {import('vue').Ref<IdType[]>} */
	const globalSelection = ref([])

	const getId = makeGetId(opts?.getId)
	const pageIds = computed(() => toValue(items).map(getId))

	const selection = computed({
		get() {
			const rs = new Set(globalSelection.value)
			return pageIds.value.filter((i) => rs.has(i))
		},
		set(v) {
			const cr = new Set(pageIds.value)
			const gb = globalSelection.value.filter((i) => !cr.has(i))
			globalSelection.value = [...new Set([...gb, ...v])]
		},
	})

	/** current state of entire selection */
	const state = computed(() => {
		const len = toValue(items).length
		const sel = selection.value.length
		return !len || !sel ? SEL_NONE : len === sel ? SEL_ALL : SEL_SOME
	})

	return {
		/** selected item ids */
		selection,
		/** selected item ids (including those no longer in `items`) */
		globalSelection,
		/** are all selected? */
		isAll: computed(() => state.value === SEL_ALL),
		/** are some selected? (note: `false` if all selected) */
		isSome: computed(() => state.value === SEL_SOME),
		/** are none selected? */
		isNone: computed(() => state.value === SEL_NONE),
		/** toggle visible selection */
		toggleAll() {
			selection.value = state.value < SEL_ALL ? [...pageIds.value] : []
		},
		/**
		 * select from last selected item to target
		 * @param {IdType} target id that is the end of selection
		 * @param clearHighlight clear highlighted text (default: `true`)
		 */
		selectUntil(target, clearHighlight = true) {
			if (selection.value.length < 1) return
			const ids = pageIds.value
			const src = selection.value.at(-1)
			const [a, b] = ids.flatMap((i, j) => (i === src || i === target ? [j] : []))
			const toSelect = new Set([...selection.value, ...ids.slice(a, b)])
			toSelect.delete(target)
			selection.value = [...toSelect, target]
			if (clearHighlight) {
				setTimeout(() => document.getSelection()?.removeAllRanges(), 10)
			}
		},
	}
}
