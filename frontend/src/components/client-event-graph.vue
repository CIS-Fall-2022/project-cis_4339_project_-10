<template>
  <div class="graphChart">
    <canvas ref="myChart"></canvas>
  </div>
  </template>

  <style>
  .graphChart {
    width: 1500px;
    margin: 0 auto;
  }
</style>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  
  Chart.register(...registerables);
  export default {
    props: {
      label: {
        type: Array,
      },
      chartData: {
        type: Array,
      },
    },
    async mounted() {
      console.log(this.chartData);
      await new Chart(this.$refs.myChart, {
        type: "bar",
        data: {
          labels: this.label,
          datasets: [
          {
              label: "Attendees",
              backgroundColor: "rgba(144,238,144 , 0.9 )",
              data: this.chartData,
            },
          ],
        },
        options: {
          scales: {
              y: {
                  min: 0,
                  max: 100
              }
          }
        }
      });
    },
  };
  </script>
