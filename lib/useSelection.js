import { ref, unref, computed } from 'vue'

/**
 * @import { Ref, MaybeRef, ComputedRef } from 'vue'
 */

const SEL_NONE = 0
const SEL_SOME = 1
const SEL_ALL = 2

/**
 * reactive selection for an array of items
 *
 * @template const ItemType
 * @template {keyof ItemType} const IdType
 * @param {MaybeRef<ItemType[]>} items
 * @param {IdType} id key in item to use as identifier
 */
export function useSelection(items, id) {
	/**
	 * selected items
	 * @type {Ref<ItemType[IdType][]>}
	 */
	const selected = ref([])

	const getIds = () => unref(items).map((i) => i[id])

	/** current state of entire selection */
	const state = computed(() => {
		const len = unref(items).length
		const sel = selected.value.length
		return !len || !sel ? SEL_NONE : len === sel ? SEL_ALL : SEL_SOME
	})

	/**
	 * toggle entire selection
	 */
	function toggleAll() {
		selected.value = state.value < SEL_ALL ? getIds() : []
	}

	/**
	 * select from last selected item to target
	 * @param {ItemType[IdType]} target
	 */
	function shiftSelect(target) {
		if (selected.value.length < 1) return
		const ids = getIds()
		const src = selected.value.at(-1)
		const [a, b] = ids.flatMap((i, j) => (i === src || i === target ? [j] : []))
		const toSelect = new Set([...selected.value, ...ids.slice(a, b)])
		toSelect.delete(target)
		selected.value = [...toSelect, target]
		setTimeout(() => document.getSelection().removeAllRanges(), 10)
	}

	return {
		state,
		selected,
		toggleAll,
		shiftSelect,
		isAll: computed(() => state.value === SEL_ALL),
		isSome: computed(() => state.value === SEL_SOME),
		isNone: computed(() => state.value === SEL_NONE),
	}
}
