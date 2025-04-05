<script lang="ts">
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';
  import { Filter, Download } from 'lucide-svelte';

  let {performanceChartEl, performanceData = []} = $props()

  onMount(() => {
    // Initialize the performance chart
    const performanceChart = new Chart(performanceChartEl, {
      type: 'line',
      data: {
        labels: performanceData.map((d) => d.name),
        datasets: [
          {
            label: 'Impressions',
            data: performanceData.map((d) => d.impressions),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: 'Clicks',
            data: performanceData.map((d) => d.clicks),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Impressions'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'Clicks'
            }
          }
        }
      }
    });
  });
</script>

<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div class="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-bold">Campaign Performance</h2>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-sm text-gray-600"
        >
          <Filter class="h-3 w-3" />
          <span>Filter</span>
        </button>
        <button
          class="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-sm text-gray-600"
        >
          <Download class="h-3 w-3" />
          <span>Export</span>
        </button>
      </div>
    </div>
    <div class="h-64">
      <canvas bind:this={performanceChartEl}></canvas>
    </div>
  </div>

  <slot />
</div>
