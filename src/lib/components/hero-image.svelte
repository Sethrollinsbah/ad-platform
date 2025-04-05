<script lang="ts">
	// Props for hero image
	interface HeroImageProps {
		imageSrc: string;
		imageAlt: string;
	}

	let { 
		imageSrc, 
		imageAlt 
	} = $props() as HeroImageProps;
</script>

<div class="relative">
	<div
		class="absolute -left-10 -top-10 h-40 w-40 rotate-12 rounded-lg border-2 border-black bg-yellow-300"
	></div>
	<div
		class="relative overflow-hidden rounded-lg border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
	>
		<img
			src={imageSrc}
			alt={imageAlt}
			class="h-full w-full object-cover"
		/>
	</div>
	<div
		class="absolute -bottom-8 -right-8 h-32 w-32 rounded-full border-2 border-black bg-blue-400"
	></div>
</div>
