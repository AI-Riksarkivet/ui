<script lang="ts">
	// A host for the avatar tests: a root with no image, so its fallback shows.
	import * as Avatar from '../../src/lib/components/avatar/index.js';

	let { initials }: { initials: string } = $props();
</script>

<Avatar.Root>
	<Avatar.Fallback>{initials}</Avatar.Fallback>
</Avatar.Root>
