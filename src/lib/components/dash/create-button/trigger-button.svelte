<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';

	let { onClick = () => {} } = $props();
</script>

<button
	id="create-button"
	class={buttonVariants({ variant: 'outline' }) + ' fixed right-4 top-24 shadow-md'}
	on:click={onClick}
>
	<Plus class="mr-[2px] size-4" /> Create
</button>
