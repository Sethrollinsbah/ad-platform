<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import TestimonialCard from './testimonial-card.svelte';

	const { testimonials } = siteContent;
</script>

<!-- Testimonials Section -->
<section id="testimonials" class="border-y-4 border-black bg-yellow-300 py-24">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-4xl font-extrabold">{testimonials.title}</h2>
			<p class="mt-4 text-xl">{testimonials.subtitle}</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each testimonials.items as testimonial, i}
				<TestimonialCard
					quote={testimonial.quote}
					name={testimonial.name}
					company={testimonial.company}
					index={i}
				/>
			{/each}
		</div>
	</div>
</section>
