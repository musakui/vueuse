import { ref, computed, watch, toValue } from 'vue'

/**
 * reactive pagination for an array of items
 *
 * @template ItemType
 * @param {import('vue').MaybeRef<ItemType[]>} items
 * @param {import('./types').PaginationOpts} opts
 */
export function usePagination(items, opts = {}) {
	const idx = ref(opts?.initialPageIndex || 0)
	const size = ref(opts?.initialPageSize || 10)

	const pageSize = computed({
		get() {
			return size.value
		},
		set(v) {
			size.value = Math.max(1, Math.ceil(v))
		},
	})

	const pageCount = computed(() => {
		return Math.ceil((toValue(items)?.length || 0) / size.value)
	})

	const pageIndex = computed({
		get() {
			return idx.value
		},
		set(v) {
			const count = pageCount.value
			idx.value = (count + v) % count
		},
	})

	const pageItems = computed(() => {
		const take = size.value
		const skip = idx.value * take
		return toValue(items).slice(skip, skip + take)
	})

	const isLastPage = computed(() => idx.value + 1 === pageCount.value)

	watch(pageCount, (v) => {
		const last = v - 1
		if (idx.value > last) {
			idx.value = last
		}
	})

	return {
		/** number of items per page */
		pageSize,
		/** 0-indexed page number */
		pageIndex,
		/** number of pages */
		pageCount,
		/** array of items on the current page */
		pageItems,
		/** currently on the last page? */
		isLastPage,
		/**
		 * go to page number (0-indexed)
		 *
		 * negative values wrap around
		 * @param {number} n
		 */
		goto(n) {
			pageIndex.value = n
		},
		/** go to next page */
		next() {
			++pageIndex.value
		},
		/** go to previous page */
		prev() {
			--pageIndex.value
		},
	}
}
