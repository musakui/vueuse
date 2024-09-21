import { VNode } from 'vue'

export type JSONHelper = (key: string, val: unknown) => unknown

export type Renderable = string | number | VNode | VNode[]

/** @see https://github.com/vuejs/core/pull/8012 */
export type ClassValue =
	| string
	| Record<string | number, unknown>
	| ClassValue[]

export type Comparable = number | boolean | bigint | string | Date

export type Comparator<ItemType> = (
	a: ItemType,
	b: ItemType,
	dir: number
) => number

export interface ColumnMeta {
	/** class for headers */
	thClass?: ClassValue

	/** class for cells */
	tdClass?: ClassValue
}

export type ColumnDefinition<ItemType, ColKey extends string> = {
	/** column key */
	key: ColKey

	/** metadata */
	meta?: ColumnMeta

	/** comparison function */
	cmp?: Comparator<ItemType>

	/**
	 * value to use for sorting
	 *
	 * ignored if `cmp` is provided
	 */
	sortBy?: string | keyof ItemType | ((i: ItemType) => Comparable)

	/**
	 * how to treat nullish values (default: `last`)
	 *
	 * ignored if `cmp` is provided
	 *
	 * `small`/`large` indicates that they will be smaller/larger than any other values
	 *
	 * `first`/`last` will always put them first/last regardless of sort direction
	 */
	nulls?: 'small' | 'large' | 'first' | 'last'
}

export type PaginationOpts = {
	/**
	 * default page size (default: 10)
	 */
	initialPageSize?: number
	/**
	 * default page index (default: 0)
	 */
	initialPageIndex?: number
}

export type SelectionOpts<ItemType, IdType> = {
	/** for type inference */
	id?: IdType

	/**
	 * function or property key to get the id for an item
	 */
	getId?: keyof ItemType | ((i: ItemType) => IdType)
}

export type StorageOpts<StoreType> = {
	/** storage key (default: `use-storage-store`) */
	key?: string

	/** initial values */
	initial?: StoreType

	/** JSON.parse reviver */
	reviver?: JSONHelper

	/** JSON.stringify replacer */
	replacer?: JSONHelper
}
