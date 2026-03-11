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

const colors = ['#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#fafafa', '#27272a']

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
