<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { buttonVariants } from '../button/index.js';
	import { AlertDialog } from './index.js';

	const { Story } = defineMeta({ title: 'Components/AlertDialog', tags: ['autodocs'] });
</script>

<Story name="Destructive confirmation">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
			Delete the project
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Title>Delete the project?</AlertDialog.Title>
			<AlertDialog.Description>
				Its items move to the trash and are purged after a day. Nobody can open them meanwhile.
			</AlertDialog.Description>
			<div class="flex justify-end gap-2">
				<AlertDialog.Cancel>Keep it</AlertDialog.Cancel>
				<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })}
					>Delete</AlertDialog.Action
				>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Story>
