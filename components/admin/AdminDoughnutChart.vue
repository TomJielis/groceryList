<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  labels: string[]
  data: number[]
  title?: string
}

const props = defineProps<Props>()

const colors = ['#f97316', '#1e3a5f', '#10b981', '#94a3b8']

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    data: props.data,
    backgroundColor: colors.slice(0, props.data.length),
    borderColor: '#18181b',
    borderWidth: 2,
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: '#71717a', font: { family: 'DM Sans', size: 12 }, boxWidth: 12 }
    },
    title: { display: !!props.title, text: props.title, color: '#a1a1aa' },
    tooltip: {
      backgroundColor: '#1e1e21',
      titleColor: '#fafafa',
      bodyColor: '#a1a1aa',
      borderColor: '#27272a',
      borderWidth: 1,
    }
  }
}
</script>

<template>
  <div class="h-64">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
