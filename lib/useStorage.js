import { reactive, watch } from 'vue'

const DEFAULT_STORAGE_KEY = 'use-storage-store'

/**
 * reactive localStorage
 *
 * @template StoreType
 * @param {import('./types').StorageOpts<StoreType>} opts
 */
export function useStorage(opts = {}) {
	const key = opts?.key || DEFAULT_STORAGE_KEY
	const raw = window.localStorage.getItem(key)

	/** @type {import('vue').Reactive<StoreType>} */
	const val = reactive({
		...opts?.initial,
		...(raw ? JSON.parse(raw, opts?.reviver) : null),
	})

	watch(val, (newVal) => {
		window.localStorage.setItem(key, JSON.stringify(newVal, opts?.replacer))
	})

	return val
}
