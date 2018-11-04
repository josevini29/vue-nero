import {
  Bar
} from 'vue-chartjs'

import { geraCorAleatorio } from '../../Util/Grafico'

export default {
  extends: Bar,
  data () {
    return {
      dadosFormat: {},
      maxY: 0,
      minY: 0
    }
  },
  props: ['dados'],
  mounted () {
    this.renderChart({
      labels: this.dadosFormat.label,
      datasets: this.dadosFormat.datasets
    }, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            // stepSize: 50,
            min: this.minY,
            max: this.maxY
          }
        }]
      }
    })
  },
  beforeMount () {
    let datasets = []
    let minValue = null
    let maxValue = null
    this.dados.grupo.forEach((grupo) => {
      let dataset = {
        label: grupo.name,
        backgroundColor: geraCorAleatorio(),
        data: grupo.values
      }
      grupo.values.forEach((value) => {
        if (minValue === null || maxValue === null) {
          minValue = value
          maxValue = value
        } else {
          if (value < minValue) {
            minValue = value
          }
          if (value > maxValue) {
            maxValue = value
          }
        }
      })
      datasets.push(dataset)
    })
    this.minY = minValue - 100
    this.maxY = maxValue + 100
    this.dadosFormat = {
      label: this.dados.label,
      datasets
    }
  }
}
