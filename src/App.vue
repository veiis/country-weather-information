<template>
  <div id="app">
    <vue-headful
            title="Title from vue-headful"
            description="Description from vue-headful"
    />
    
    <div class="container">
      <!-- Start of Search -->
      <div class="search">
        <h2>SELECT A COUNTRY</h2>
        <select name="country" id="reg_select" v-model="selectedCountry" @change="getWeatherData">
          <option
            v-for="country in countriesNames"
            v-model="countriesNames[0]"
            :value="country"
          >{{ country }}</option>
        </select>
      </div>
      <!-- End of Search -->
      <!-- Start of Boxes [Top Section] -->
      <div class="boxs">
        <div class="card-container">
          <div class="card bg-gray">
            <div class="hs">
              <h2>{{ currentCountry.name }}</h2>
            </div>
            <div class="pr">
              <p>
                Native Name:
                <span>{{ currentCountry.nativeName }}</span>
              </p>
              <p>
                Capital:
                <span>{{ currentCountry.capital }}</span>
              </p>
              <p>
                Region:
                <span>{{ currentCountry.region }} {{ currentCountry.subregion }}</span>
              </p>
              <p>
                Population:
                <span>{{ currentCountry.population }}</span>
              </p>
              <p>
                Languages:
                <span
                  v-for="lang in currentCountry.languages"
                >{{ lang.name }}, {{ lang.nativeName }}</span>
              </p>
              <p>
                Timezones:
                <span v-for="zone in currentCountry.timezones">{{ zone }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="card-container">
          <div class="card">
            <div class="hs">
              <h2>CALLING CODE</h2>
            </div>
            <h1 v-for="callCode in currentCountry.callingCodes">{{ callCode }}</h1>
          </div>
        </div>
        <div class="card-container tb">
          <div class="card img-pad">
            <img class="flag-img" :src="currentCountry.flag" />
          </div>
        </div>
      </div>
      <!-- End of Boxes [Section 1] -->
      <!-- Start of Boxes [Section 2] -->
      <div class="boxs">
        <div class="card-container-weather">
          <div class="card">
            <div class="hs">
              <h2>CAPITAL WEATHER REPORT</h2>
            </div>
            <img
              class="weather-status"
              v-if="checkObject(currentWeather)"
              :src="'http://openweathermap.org/img/w/'+currentWeather.weather[0].icon+'.png'"
            />
            <div class="pr">
              <p class="txt-grey">
                <img src="./assets/wind.png" /> Wind Speed:
                <span v-if="checkObject(currentWeather)">{{ currentWeather.wind.speed }}</span>ms
              </p>
              <p class="txt-grey">
                <img src="./assets/temp.png" /> Temperature:
                <span v-if="checkObject(currentWeather)">{{ currentWeather.main.temp }}</span>c
              </p>
              <p class="txt-grey">
                <img src="./assets/humidity.png" /> Humidity:
                <span
                  v-if="checkObject(currentWeather)"
                >{{ currentWeather.main.humidity }}</span>%
              </p>
              <p class="txt-grey">
                <img src="./assets/visibility.png" /> Visibility:
                <span v-if="checkObject(currentWeather)">{{ currentWeather.visibility }}</span>m
              </p>
            </div>
          </div>
        </div>
        <div class="card-container-map">
          <div class="card">
            <div id="map" class="shadow">
              <l-map v-if="checkObject(currentWeather)" :zoom="map.zoom" :center="map.center">
                <l-tile-layer :url="map.url" :attribution="map.attribution"></l-tile-layer>
              </l-map>
            </div>
          </div>
        </div>
      </div>
      <!-- End of Boxes [Section 2] -->
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import vueHeadful from 'vue-headful';

export default {
  name: "app",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    vueHeadful
  },
  data: function() {
    return {
      countries: [],
      countriesNames: [],
      selectedCountry: "ddd",
      currentCountry: {},
      currentWeather: {},
      map: {
        zoom: 11,
        center: L.latLng(0, 0),
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
    };
  },

  methods: {
    // Get index of an option that we select
    getIndexOfOption(countryName) {
      return this.countriesNames.indexOf(countryName);
    },

    checkObject(obj) {
      if (Object.keys(obj).length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    // Get Weather of the country that we select. to determine wich country wee need to get weather data we using index. because we use the
    // capital of country and to access that we need to access the index of the country in countries Array
    getWeatherData() {
      this.currentCountry = this.countries[
        this.getIndexOfOption(this.selectedCountry)
      ];
      this.$http
        .get(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            this.currentCountry.capital +
            "&units=metric&appid=b11102c85a634f934866cc65493df3d4"
        )
        .then(data => {
          this.currentWeather = data.body;
          this.map.center = L.latLng(data.body.coord.lat, data.body.coord.lon);
        });
    }
  },

  mounted() {
    this.$http.get("https://restcountries.eu/rest/v2/").then(data => {
      for (let i = 0; i < data.body.length; i++) {
        this.countriesNames.push(data.body[i].name);
        this.countries.push(data.body[i]);
      }
      console.log(this.countries)
      this.currentCountry = this.countries[107];
      console.log(this.countries)
      this.selectedCountry = this.currentCountry.name;
    });

    this.$http
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=Tehran&units=metric&appid=b11102c85a634f934866cc65493df3d4"
      )
      .then(data => {
        this.currentWeather = data.body;
        this.map.center = L.latLng(data.body.coord.lat, data.body.coord.lon);
      });
  }
};
</script>

<style>
@import "./assets/style.css";
@import "https://unpkg.com/leaflet@1.5.1/dist/leaflet.css";
</style>