<script lang="ts">
	// Props for submit button
	interface SubmitButtonProps {
		text: string;
		onSubmit?: () => void;
	}

	let { text, onSubmit = () => {} } = $props() as SubmitButtonProps;
</script>

<button
	type="submit"
	class="w-full rounded-lg border-2 border-black bg-red-500 px-8 py-4 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
	onclick={onSubmit}
>
	{text}
</button>
