<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './checkbox.svelte';

	const { Story } = defineMeta({
		title: 'Components/Checkbox',
		tags: ['autodocs'],
	});
</script>

<Story name="States">
	<div class="flex flex-col gap-3 text-sm">
		<label class="flex items-center gap-2"><Checkbox /> Unchecked</label>
		<label class="flex items-center gap-2"><Checkbox checked /> Checked</label>
		<label class="flex items-center gap-2"><Checkbox indeterminate /> Indeterminate</label>
		<label class="flex items-center gap-2"><Checkbox disabled /> Disabled</label>
	</div>
</Story>
