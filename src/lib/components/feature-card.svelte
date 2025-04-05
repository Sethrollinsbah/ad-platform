<script lang="ts">
	// Define props for the feature card
	interface FeatureProps {
		icon: string;
		title: string;
		description: string;
		color: 'red' | 'blue' | 'amber';
	}

	let { icon, title, description, color = 'red' } = $props() as FeatureProps;

	// Map of colors to Tailwind shadow classes
	const shadowColors = {
		red: 'shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]',
		blue: 'shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]',
		amber: 'shadow-[8px_8px_0px_0px_rgba(245,158,11,1)]'
	};

	// Map of colors to Tailwind background classes
	const bgColors = {
		red: 'bg-yellow-300',
		blue: 'bg-blue-300',
		amber: 'bg-red-300'
	};
</script>

<div class="rounded-lg border-4 border-black bg-white p-8 {shadowColors[color]}">
	<div
		class="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-black {bgColors[
			color
		]}"
	>
		<span class="text-3xl">{icon}</span>
	</div>
	<h3 class="mb-4 text-2xl font-bold">{title}</h3>
	<p>{description}</p>
</div>
