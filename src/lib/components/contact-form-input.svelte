<script lang="ts">
	// Props for form input
	interface FormInputProps {
		id: string;
		label: string;
		type?: 'text' | 'email' | 'tel' | 'textarea';
		placeholder: string;
		required?: boolean;
	}

	let { id, label, type = 'text', placeholder, required = false } = $props() as FormInputProps;

	// Determine input or textarea based on type
	const inputClass =
		'w-full rounded-lg border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-red-500';
</script>

{#if type === 'textarea'}
	<div class="mb-6">
		<label for={id} class="mb-2 block font-bold">{label}</label>
		<textarea {id} {required} rows="4" class={inputClass} {placeholder}></textarea>
	</div>
{:else}
	<div class="mb-6">
		<label for={id} class="mb-2 block font-bold">{label}</label>
		<input {type} {id} {required} class={inputClass} {placeholder} />
	</div>
{/if}
