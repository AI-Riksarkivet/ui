<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	const { Story } = defineMeta({ title: 'Welcome', tags: ['autodocs'] });
</script>

<Story name="Intro">
	<div class="flex max-w-2xl flex-col gap-4 p-8">
		<h1 class="text-2xl">@riksarkivet/ui</h1>
		<p class="text-muted-foreground">
			A Svelte 5 design system on Bits UI and Tailwind 4, read from source by the apps that use it.
			Every story renders in the theme and mode picked in the toolbar above; DESIGN.md in the
			repository describes the look and its rules.
		</p>
	</div>
</Story>
