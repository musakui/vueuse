/** @import { Reactive } from 'vue' */
import { reactive, watch } from 'vue'

const DEFAULT_STORAGE_KEY = 'use-storage-store'

const stores = new Map()

/**
 * reactive localStorage
 *
 * @template StoreType
 * @param {import('./types').StorageOpts<StoreType>} opts
 */
export function useStorage(opts = {}) {
	const key = opts?.key || DEFAULT_STORAGE_KEY

	/** @type {Reactive<StoreType> | undefined} */
	const store = stores.get(key)
	if (store) return store

	const raw = window.localStorage.getItem(key)

	/** @type {Reactive<StoreType>} */
	const val = reactive({
		...opts?.initial,
		...(raw ? JSON.parse(raw, opts?.reviver) : null),
	})

	watch(val, (newVal) => {
		window.localStorage.setItem(key, JSON.stringify(newVal, opts?.replacer))
	})

	stores.set(key, val)

	return val
}
