<script lang="ts">
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';

  let {summaryCards = [], sparklineEls = [], sparklineCharts = []} = $props()

  onMount(() => {
    // Initialize sparkline charts
    summaryCards.forEach((card, index) => {
      if (sparklineEls[index]) {
        sparklineCharts[index] = new Chart(sparklineEls[index], {
          type: 'line',
          data: {
            labels: [...Array(card.chartData.length).keys()].map(String),
            datasets: [
              {
                data: card.chartData,
                borderColor: card.lineColor,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: {
              x: { display: false },
              y: { display: false }
            },
            elements: {
              line: { tension: 0.4 }
            }
          }
        });
      }
    });
  });
</script>

<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {#each summaryCards as card, i}
    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-500">{card.title}</span>
        <svelte:component this={card.icon} class="h-5 w-5 {card.iconColor}" />
      </div>
      <div class="mb-2 flex items-baseline">
        <span class="text-2xl font-bold">{card.value}</span>
        <span class={`ml-2 text-xs font-medium ${card.isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {card.change}
        </span>
      </div>
      <div class="h-10">
        <canvas bind:this={sparklineEls[i]}></canvas>
      </div>
    </div>
  {/each}
</div>
