<script lang="ts">
	// Define props for the how-it-works step
	interface StepProps {
		number: number;
		title: string;
		description: string;
	}

	let { number, title, description } = $props() as StepProps;
</script>

<div
	class="relative rounded-lg border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
>
	<div
		class="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-yellow-300 text-xl font-bold"
	>
		{number}
	</div>
	<h3 class="mb-4 mt-2 text-xl font-bold">{title}</h3>
	<p>{description}</p>
</div>
