<template>
  <main>
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
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">List of Events</h1>
    </div>
    <div class="px-10 pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Event By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy"
          >
            <option value="Event Name">Event Name</option>
            <option value="Event Date">Event Date</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Event Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter event name"
            />
          </label>
        </div>
        <!-- Displays event date search field -->
        <div class="flex flex-col" v-if="searchBy === 'Event Date'">
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            type="date"
            v-model="eventDate"
            v-on:keyup.enter="handleSubmitForm"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div></div>
        <div class="mt-5 grid-cols-2">
          <button
            class="mr-10 border border-red-700 bg-white text-red-700 rounded"
            @click="clearSearch"
            type="submit"
          >Clear Search</button>
          <button
            class="bg-red-700 text-white rounded"
            @click="handleSubmitForm"
            type="submit"
          >Search Event</button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2>
        <h3 class="italic">Click table row to edit/display an entry</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Event Date</th>
              <th class="p-4 text-left">Event Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editEvent(event._id)" v-for="event in queryData" :key="event._id">
              <td class="p-2 text-left">{{ event.eventName }}</td>
              <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.address.line1 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import { DateTime } from "luxon";
import axios from "axios";

export default {
  data() {
    return {
      queryData: [],
      //Parameter for search to occur
      searchBy: "",
      eventName: "",
      eventDate: "",
      error: null,
    };
  },
  mounted() {
    this.eventlist();
    window.scrollTo(0, 0);
  },
  methods: {
    async eventlist() {
      try {
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
        this.queryData = [];
        await axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
        });
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
    },
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    async handleSubmitForm() {
      try {
      let apiURL = "";
      if (this.searchBy === "Event Name") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/eventdata/search/?eventName=${this.eventName}&searchBy=name`;
      } else if (this.searchBy === "Event Date") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/eventdata/search/?eventDate=${this.eventDate}&searchBy=date`;
      }
      
      await axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
        console.log(apiURL);
      });
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
    },
    clearSearch() {
      //Resets all the variables
      this.searchBy = "";
      this.eventName = "";
      this.eventDate = "";

      //get all entries
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
      this.queryData = [];
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
      });
    },
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } });
    },
  },
};
</script>