import { ref, unref, computed } from 'vue'

/**
 * reactive pagination for an array of items
 *
 * @template const ItemType
 * @param {import('vue').MaybeRef<ItemType[]>} items
 * @param {object} [opts]
 * @param {number} [opts.defaultPerPage]
 */
export function usePagination(items, opts) {
	const pg = ref(0)
	const curPage = computed(() => Math.floor(pg.value) + 1)

	const perPage = ref(opts?.defaultPerPage || 20)
	const pp = computed(() => (perPage.value > 0 ? Math.ceil(perPage.value) : 1))

	const numPages = computed(() => {
		return Math.ceil((unref(items)?.length || 0) / pp.value)
	})

	const pageItems = computed(() => {
		const take = pp.value
		const skip = pg.value * take
		return unref(items).slice(skip, skip + take)
	})

	const isFirstPage = computed(() => curPage.value === 1)
	const isLastPage = computed(() => curPage.value === numPages.value)

	/**
	 * go to page number (0-indexed)
	 *
	 * negative values wrap around
	 *
	 * @param {number} n
	 */
	function goto(n) {
		pg.value = n < 0 ? numPages.value + n : n
	}

	/** go to next page */
	function next() {
		if (isLastPage.value) return false
		++pg.value
		return true
	}

	/** go to previous page */
	function prev() {
		if (isFirstPage.value) return false
		--pg.value
		return true
	}

	return {
		curPage,
		perPage,
		numPages,
		pageItems,
		isLastPage,
		isFirstPage,
		goto,
		next,
		prev,
	}
}
