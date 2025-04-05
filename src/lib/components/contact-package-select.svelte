<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	// Props for package select
	interface PackageSelectProps {
		packageOptions: Array<{
			value: string;
			label: string;
		}>;
	}

	let { packageOptions } = $props() as PackageSelectProps;
</script>

<div class="mb-6">
	<label for="package" class="mb-2 block font-bold">Interested In</label>

	<Select.Root portal={null}>
		<Select.Trigger
			class="w-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-red-500"
		>
			<Select.Value id="package" placeholder="Select a package to discuss during our call" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Packages</Select.Label>
				{#each packageOptions as option}
					<Select.Item value={option.value} label={option.label}>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="package" />
	</Select.Root>
</div>
