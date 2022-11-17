<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <!-- Bar Chart data for clients who signed up for an event the last 2 months -->
    <div>
        <h3 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Event Data For Past 2 Months</h3>
        <div>
          <div>
            <GraphBar
              v-if="!loading && !error"
              :label="events"
              :chart-data="attendees"
            ></GraphBar>
            <br>
            <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event</th>
              <th class="p-4 text-left">Number of Attendees</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="event in queryData" :key="event._id">
              <td class="p-2 text-left">{{ event.eventName}}</td>
              <td class="p-2 text-left">{{ event.NumberAttendees}}</td>
            </tr>
          </tbody>
        </table>
            <!-- Start of loading animation -->
            <div class="mt-40" v-if="loading">
              <p
                class="
                  text-6xl
                  font-bold
                  text-center text-gray-500
                  animate-pulse
                "
              >
                Loading...
              </p>
            </div>
            <!-- End of loading animation -->

            <!-- Start of error alert -->
            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
            <!-- End of error alert -->
            <br />
            <br />
          </div>
        </div>
      </div>
  </main>
</template>

<script>
import axios from "axios";
import GraphBar from "@/components/client-event-graph.vue";

export default {
  components: {
    GraphBar
  },
  data() {
    return {
      queryData: [],
      events: [],
      attendees: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventData/historical/`;
        const response = await axios.get(apiURL);
        //"re-organizing" - mapping json from the response
        this.queryData = response.data 
        this.events = response.data.map((item) => item.eventName);
        this.attendees = response.data.map((item) => item.NumberAttendees);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
