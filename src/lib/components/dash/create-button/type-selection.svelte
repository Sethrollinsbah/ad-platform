<script lang="ts">
  import { Calendar, Layers, Database } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  
let {onSelect = (type: string) => {}} = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
  <Button 
    variant="outline" 
    class="flex h-24 flex-col items-center justify-center gap-2 p-4"
    on:click={() => onSelect('campaign')}
  >
    <Calendar class="h-8 w-8 text-red-500" />
    <span>Campaign</span>
  </Button>
  
  <Button 
    variant="outline" 
    class="flex h-24 flex-col items-center justify-center gap-2 p-4"
    on:click={() => onSelect('platform')}
  >
    <Layers class="h-8 w-8 text-blue-500" />
    <span>Platform</span>
  </Button>
  
  <Button 
    variant="outline" 
    class="flex h-24 flex-col items-center justify-center gap-2 p-4"
    on:click={() => onSelect('table')}
  >
    <Database class="h-8 w-8 text-green-500" />
    <span>Data Table</span>
  </Button>
</div>
