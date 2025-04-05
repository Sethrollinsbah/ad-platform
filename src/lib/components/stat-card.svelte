<script lang="ts">
	// Define props for the stat card
	interface StatCardProps {
		value: string;
		label: string;
	}

	let { value, label } = $props() as StatCardProps;
</script>

<div
	class="rounded-lg border-4 border-black bg-white p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
>
	<div class="text-4xl font-extrabold">{value}</div>
	<div class="mt-2 font-bold">{label}</div>
</div>
