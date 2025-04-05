<script lang="ts">
  import { Calendar, Clipboard, ChevronDown } from 'lucide-svelte';
  
  let {dateRange = 'Last 14 Days'} = $props();
</script>

<header class="border-b border-gray-200 bg-white shadow-sm">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold">Analytics</h1>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
        <Calendar class="h-4 w-4 text-gray-500" />
        <span>{dateRange}</span>
        <ChevronDown class="h-4 w-4 text-gray-500" />
      </div>
      <div class="rounded-full bg-red-100 p-2 text-red-600">
        <Clipboard class="h-5 w-5" />
      </div>
      <div class="h-8 w-8 rounded-full bg-gray-200"></div>
    </div>
  </div>
</header>
