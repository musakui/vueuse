import { reactive, watch } from 'vue'

/**
 * @import { Reactive } from 'vue'
 */

const DEFAULT_STORAGE_KEY = 'use-storage-store'

/**
 * reactive localStorage
 *
 * @template StorageType
 * @param {object} [opts]
 * @param {string} [opts.key] storage key
 * @param {StorageType} [opts.initial] initial values
 */
export function useStorage(opts) {
	const key = opts?.key || DEFAULT_STORAGE_KEY
	const raw = window.localStorage.getItem(key)

	/** @type {Reactive<StorageType>} */
	const val = reactive({
		...opts?.initial,
		...(raw ? JSON.parse(raw) : null),
	})

	watch(val, (newVal) => {
		window.localStorage.setItem(key, JSON.stringify(newVal))
	})

	return val
}
