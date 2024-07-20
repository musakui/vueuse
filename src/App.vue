<script setup>
import { ref } from 'vue'
import { useSelection, usePagination } from '../lib/index.js'

const items = ref(
	Array.from({ length: 32 }, (_, id) => ({
		id,
		name: `item ${id + 1}`,
	}))
)

const { selected, isAll, isSome, ...selection } = useSelection(items, 'id')
const { curPage, numPages, pageItems, isFirstPage, isLastPage, ...pagination } = usePagination(items, { defaultPerPage: 10 })
</script>

<template>
	<pre>selected: [{{ selected.join(', ') }}]</pre>
	<pre>page: {{ curPage }} of {{ numPages }}</pre>
	<div class="pagination">
		<button :disabled="isFirstPage" @click="pagination.goto(0)">⏮</button>
		<button :disabled="isFirstPage" @click="pagination.prev">◀</button>
		<button :disabled="isLastPage" @click="pagination.next">▶</button>
		<button :disabled="isLastPage" @click="pagination.goto(-1)">⏭</button>
	</div>
	<div class="items">
		<label>
			<input type="checkbox" :checked="isAll" :indeterminate="isSome" @click="selection.toggleAll" />
			items
		</label>

		<div v-for="item of pageItems" :key="item.id">
			<label @click.shift="selection.shiftSelect(item.id)">
				<input type="checkbox" v-model="selected" :value="item.id" />
				{{ item.name }}
			</label>
		</div>
	</div>
</template>

<style>
:root {
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
	line-height: 1.5;
	font-weight: 400;

	color-scheme: light dark;
	color: rgba(255, 255, 255, 0.87);
	background-color: #242424;

	font-synthesis: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

body {
	margin: 0;
	display: flex;
	min-height: 100vh;
}

#app {
	padding: 12px;
}

.items {
	display: flex;
	flex-direction: column;
	gap: 3px;
}

.pagination {
	display: flex;
	gap: 3px;
	padding: 12px 5px;
}

.pagination button {
	cursor: pointer;
	text-align: center;
	padding: 5px 10px;
	border: none;
	border-radius: 3px;
}

.pagination button:disabled {
	cursor: inherit;
	background-color: #333;
}
</style>
