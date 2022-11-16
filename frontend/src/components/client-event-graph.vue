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
              backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
              ],
              borderWidth: 1,
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
