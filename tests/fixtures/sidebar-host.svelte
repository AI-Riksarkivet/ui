<script lang="ts">
	// A host for the sidebar tests: a provider, a sidebar with one row that has a tooltip (as every row
	// of a rail that collapses to icons does), and the trigger that opens the sheet at phone width.
	import * as Sidebar from '../../src/lib/components/sidebar/index.js';

	let { mobileTitle, mobileDescription }: { mobileTitle?: string; mobileDescription?: string } =
		$props();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" {mobileTitle} {mobileDescription}>
		<Sidebar.Content>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent="Tables">Tables</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Trigger />
</Sidebar.Provider>
