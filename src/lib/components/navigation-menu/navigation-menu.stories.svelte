<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import * as NavigationMenu from './index.js';

	const { Story } = defineMeta({ title: 'Components/NavigationMenu', tags: ['autodocs'] });

	const AREAS = [
		{ href: '#collections', title: 'Collections', description: 'Every collection you can read.' },
		{ href: '#projects', title: 'Projects', description: 'Where the work is organised.' },
	];
</script>

<Story name="A trigger and a plain link">
	<div class="h-64">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Browse</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-80 gap-1 p-2">
							{#each AREAS as area (area.href)}
								<li>
									<NavigationMenu.Link href={area.href}>
										<span>{area.title}</span>
										<span class="text-muted-foreground text-xs">{area.description}</span>
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="#settings" class={NavigationMenu.navigationMenuTriggerStyle()}>
						Settings
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</Story>
