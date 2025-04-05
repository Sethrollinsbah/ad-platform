<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { onCancel = () => {} } = $props();
</script>

<div class="flex justify-between">
	<Button variant="outline" on:click={onCancel}>Cancel</Button>
</div>
