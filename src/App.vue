<script setup>
import { ref } from 'vue'
import { useSelection, usePagination } from '../lib/index.js'

const items = ref(
	Array.from({ length: 32 }, (_, id) => ({
		id,
		name: `item ${id + 1}`,
	}))
)

const { pageSize, pageIndex, pageCount, pageItems, isLastPage, ...pgn } = usePagination(items, { initialPageSize: 7 })
const { selection, globalSelection, isAll, isSome, ...sel } = useSelection(pageItems, { id: '' })
</script>

<template>
	<pre>selected: [{{ globalSelection.join(', ') }}]</pre>
	<pre>page {{ pageIndex + 1 }} / {{ pageCount }}</pre>
	<div class="pagination">
		<label>
			per page
			<select v-model="pageSize">
				<option v-for="v in [7, 10, 20]" :value="v">{{ v }}</option>
			</select>
		</label>
		<div></div>
		<button :disabled="!pageIndex" @click="pgn.goto(0)">⏮</button>
		<button :disabled="!pageIndex" @click="pgn.prev">◀</button>
		<button :disabled="isLastPage" @click="pgn.next">▶</button>
		<button :disabled="isLastPage" @click="pgn.goto(-1)">⏭</button>
	</div>
	<div class="items">
		<label>
			<input type="checkbox" :checked="isAll" :indeterminate="isSome" @click="sel.toggleAll" />
			items
		</label>

		<div v-for="item of pageItems" :key="item.id">
			<label @click.shift="sel.selectUntil(item.id)">
				<input type="checkbox" v-model="selection" :value="item.id" />
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
	padding: 3px 7px;
	border: none;
	border-radius: 3px;
}

.pagination button:disabled {
	cursor: inherit;
	background-color: #333;
}
</style>
