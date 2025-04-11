<script>
	import { settingsPanel } from '@/lib';
	import SchemaTabla from './schema-tabla.svelte';
</script>

{#if $settingsPanel.type === 'table'}
	<SchemaTable></SchemaTable>
{/if}
