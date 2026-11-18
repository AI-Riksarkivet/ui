<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SortHeader from './sort-header.svelte';

	const { Story } = defineMeta({
		title: 'Components/SortHeader',
		tags: ['autodocs'],
	});
</script>

<script lang="ts">
	let sortKey = $state('name');
	let sortDir = $state<'asc' | 'desc'>('asc');

	function onsort(col: string): void {
		if (sortKey === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		else {
			sortKey = col;
			sortDir = 'asc';
		}
	}
</script>

<Story name="Sortable columns">
	<table class="text-sm">
		<thead>
			<tr>
				<SortHeader label="Name" col="name" {sortKey} {sortDir} {onsort} />
				<SortHeader label="Created" col="created" {sortKey} {sortDir} {onsort} />
			</tr>
		</thead>
	</table>
</Story>
