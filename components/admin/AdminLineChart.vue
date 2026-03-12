<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
  title?: string
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, i) => ({
    ...ds,
    borderColor: ds.borderColor || (i === 0 ? '#f97316' : '#1e3a5f'),
    backgroundColor: ds.backgroundColor || (i === 0 ? 'rgba(249,115,22,0.1)' : 'rgba(30,58,95,0.1)'),
    borderWidth: 1.5,
    pointRadius: 2,
    pointHoverRadius: 4,
    tension: 0.3,
    fill: true,
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
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
  },
  scales: {
    x: {
      grid: { color: '#27272a' },
      ticks: { color: '#52525b', font: { family: 'DM Sans' } },
      border: { color: '#27272a' }
    },
    y: {
      grid: { color: '#27272a' },
      ticks: { color: '#52525b', font: { family: 'DM Sans' } },
      border: { color: '#27272a' }
    }
  }
}
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
