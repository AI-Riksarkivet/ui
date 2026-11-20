<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Archive, FolderOpen, Settings } from '@lucide/svelte';
	import * as Sidebar from './index.js';

	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		tags: ['autodocs'],
		parameters: { layout: 'fullscreen' },
	});

	const PAGES = [
		{ href: '#collections', label: 'Collections', icon: Archive, active: true },
		{ href: '#projects', label: 'Projects', icon: FolderOpen, active: false },
		{ href: '#settings', label: 'Settings', icon: Settings, active: false },
	];
</script>

{#snippet frame(mobileTitle?: string)}
	<div class="h-[28rem]">
		<Sidebar.Provider class="min-h-0 h-full">
			<Sidebar.Root collapsible="icon" class="absolute h-full" {mobileTitle}>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Pages</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each PAGES as page (page.href)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={page.active} tooltipContent={page.label}>
											{#snippet child({ props })}
												<a href={page.href} {...props}>
													<page.icon />
													<span>{page.label}</span>
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<Sidebar.Inset class="p-4">
				<Sidebar.Trigger />
				<p class="text-muted-foreground mt-4 text-sm">The page beside the sidebar.</p>
			</Sidebar.Inset>
		</Sidebar.Provider>
	</div>
{/snippet}

<Story name="Collapsible to icons">
	{@render frame()}
</Story>

<!-- Below the width the sidebar folds at, it is a sheet behind the trigger: a title row with its own close
     button, no tooltip on its rows (Escape on a row closes the sheet), and the title the app gives it. -->
<Story name="At phone width" globals={{ viewport: { value: 'mobile1', isRotated: false } }}>
	{@render frame('Pages')}
</Story>
