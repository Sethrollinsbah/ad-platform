<script>
	let { int } = $props();
</script>

<div class="w-12">
	{#if int === 'platform'}
		<img
			class="size-8"
			src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
		/>
	{/if}
</div>
