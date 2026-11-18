<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from '../input/input.svelte';
	import Switch from '../switch/switch.svelte';
	import Field from './field.svelte';

	const { Story } = defineMeta({ title: 'Components/Field', tags: ['autodocs'] });
</script>

<Story name="Stacked">
	<div class="w-80">
		<Field label="Name" description="Shown to everyone who can read the project.">
			<Input placeholder="A name" />
		</Field>
	</div>
</Story>

<Story name="Inline">
	<div class="w-80">
		<Field label="Notify me" description="When a review is sent back." inline>
			<Switch aria-label="Notify me" />
		</Field>
	</div>
</Story>
