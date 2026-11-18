<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './input.svelte';

	const { Story } = defineMeta({
		title: 'Components/Input',
		component: Input,
		tags: ['autodocs'],
		args: { placeholder: 'Type here', 'aria-label': 'Example' },
	});
</script>

<Story name="Default" />

<Story name="With a value" args={{ value: 'A written value' }} />

<Story name="Invalid" args={{ 'aria-invalid': true, value: 'not-an-email' }} />

<Story name="Disabled" args={{ disabled: true }} />
