<script lang="ts">
	// Define props for the testimonial card
	interface TestimonialProps {
		quote: string;
		name: string;
		company: string;
		index?: number;
	}

	let { quote, name, company, index = 0 } = $props() as TestimonialProps;

	// Generate star rating dynamically
	function generateStars(count: number = 5) {
		return '⭐'.repeat(count);
	}
</script>

<div
	class="relative rounded-lg border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] {index ===
	1
		? 'md:mt-8'
		: ''}"
>
	<div class="mb-6 text-5xl">
		{generateStars()}
	</div>
	<p class="mb-6 italic">
		"{quote}"
	</p>
	<div class="flex items-center">
		<div class="mr-4 h-12 w-12 rounded-full border-2 border-black bg-gray-300"></div>
		<div>
			<div class="font-bold">{name}</div>
			<div>{company}</div>
		</div>
	</div>
</div>
