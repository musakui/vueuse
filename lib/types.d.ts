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
