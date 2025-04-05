<script lang="ts">
	import { siteContent } from '$lib/data/site-content';
	import ContactFormInput from './contact-form-input.svelte';
	import ContactPackageSelect from './contact-package-select.svelte';
	import ContactSubmitButton from './contact-submit-button.svelte';
	import { onMount } from 'svelte';

	const { contact } = siteContent;

	// You can add interactive functionality here
	let isScrolled = $state(false);

	// Handle scroll for sticky header effect
	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// For a real implementation, you would add form submission logic
	function handleSubmit(e: Event) {
		e.preventDefault();
		// Process form submission
		alert("Thanks for your interest! We'll contact you soon.");
	}
</script>

<!-- Contact Section -->
<section id="contact" class="bg-amber-50 py-24">
	<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="text-4xl font-extrabold">{contact.title}</h2>
			<p class="mt-4 text-xl">{contact.subtitle}</p>
		</div>

		<div class="mx-auto max-w-2xl">
			<div
				class="rounded-lg border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]"
			>
				<form onsubmit={handleSubmit}>
					<ContactFormInput
						id="name"
						label="Restaurant Name"
						placeholder="Your Restaurant Name"
						required={true}
					/>

					<ContactFormInput
						id="email"
						type="email"
						label="Email Address"
						placeholder="you@example.com"
						required={true}
					/>

					<ContactFormInput
						id="phone"
						type="tel"
						label="Phone Number"
						placeholder="(123) 456-7890"
						required={true}
					/>

					<ContactPackageSelect packageOptions={contact.packageOptions} />

					<ContactFormInput
						id="message"
						type="textarea"
						label="Tell Us About Your Restaurant"
						placeholder="What type of cuisine do you serve? What are your goals?"
						required={true}
					/>

					<ContactSubmitButton text={contact.submitButtonText} onSubmit={handleSubmit} />
				</form>
			</div>
		</div>
	</div>
</section>
