import React, { Component } from "react";
import axios from "axios";

import timeConvert from "../../utils/timeConvert";

import "./mainscreen.css";
import animateScrollTo from "animated-scroll-to";
import MainWidget from "../mainWidget/mainWidget";
import OtherLocations from "../otherLocations/otherLocations";
import AddLocation from "../addLocation/addLocation";
import OtherLocationListItem from "../otherLocationListItem/otherLocationListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faMapPin);
class MainScreen extends Component {
  state = {
    lat: null,
    lon: null,
    celsius: true,
    loader: true,
    addLocation: false,
    header: "Current Location",
    currentLocation: null,
    gpsAvailable: true
  };

  get(lat = this.state.lat, lon = this.state.lon) {
    let url = `${process.env.REACT_APP_GETDATA}${lat}/${lon}`;
    return axios.get(url);
  }
  addLocation() {
    let addLocation = !this.state.addLocation;
    this.setState({ addLocation });
  }
  async getData(lat, lon) {
    const { data } = await this.get(lat, lon);
    let humidity = data.currently.humidity;
    let windSpeed = data.currently.windSpeed;
    let visibility = data.currently.visibility;
    let uvIndex = data.currently.uvIndex;
    let timestamp = timeConvert(data.currently.time);
    let feelsLike = data.currently.apparentTemperature;
    let temp = data.currently.temperature;
    let desc = data.currently.summary;
    let icon = data.currently.icon;
    let daily = data.daily;
    let hourly = data.hourly;
    let high_temp = data.daily.data[0].temperatureMax;
    let low_temp = data.daily.data[0].temperatureMin;
    let sunrise = data.daily.data[0].sunriseTime;
    let sunset = data.daily.data[0].sunsetTime;
    let country = data.country;
    let name = data.name;
    this.setState({
      daily,
      country,
      name,
      hourly,
      high_temp,
      low_temp,
      sunrise,
      sunset,
      loader: false,
      humidity,
      windSpeed,
      visibility,
      uvIndex,
      timestamp,
      feelsLike,
      temp,
      desc,
      icon
    });
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        this.setState(
          {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          },
          this.getData
        )
      );
    } else {
      console.log("not foudn");
      this.setState({ gpsAvailable: false, loader: false });
    }
  }
  handleClose() {
    let addLocation = !this.state.addLocation;
    this.setState({ addLocation });
  }
  addCity(city) {
    let addLocation = !this.state.addLocation;
    this.setState({ addLocation });
    localStorage.setItem(city.id, JSON.stringify(city));
  }
  celsiusChanged(c) {
    this.setState({ celsius: c });
  }
  handleClick(city) {
    let lat = city.coord.lat;
    let lon = city.coord.lon;
    let data = this.state;
    let currentCity = {
      coord: {
        lon: data.lon,
        lat: data.lat
      },
      country: data.country,
      desc: data.desc,
      icon: data.icon,
      maxTemp: Math.round(data.high_temp),
      minTemp: Math.round(data.low_temp),
      name: data.name,
      sunrise: data.sunrise,
      sunset: data.sunset,
      temp: Math.round(data.temp)
    };

    this.setState({
      lat,
      lon,
      header: city.name,
      currentLocation: currentCity
    });
    this.getData(lat, lon);
    animateScrollTo(0, { minDuration: 700 });
  }
  showCurrentCity(city) {
    let lat = city.coord.lat;
    let lon = city.coord.lon;
    this.setState({
      lat,
      lon,
      header: "Current Location",
      currentLocation: null
    });
    this.getData(lat, lon);
    animateScrollTo(0, { minDuration: 700 });
  }
  render() {
    let { loader, addLocation, currentLocation, gpsAvailable } = this.state;

    return (
      <div className="main">
        {loader && (
          <img src="/static/loader.svg" alt="Please Wait" className="loader" />
        )}

        {!loader && gpsAvailable && (
          <div>
            {!addLocation && (
              <div>
                <MainWidget
                  data={this.state}
                  celsiusChanged={c => this.celsiusChanged(c)}
                />
                {currentLocation && (
                  <div>
                    <p />
                    <p className="header">
                      <FontAwesomeIcon icon="map-pin" /> Current Location
                    </p>
                    <OtherLocationListItem
                      city={currentLocation}
                      celsius={this.state.celsius}
                      handleClick={city => this.showCurrentCity(city)}
                    />
                  </div>
                )}
                <OtherLocations
                  handleAddLocation={() => this.addLocation()}
                  celsius={this.state.celsius}
                  header="Other Locations"
                  handleClick={city => this.handleClick(city)}
                />
              </div>
            )}
            {addLocation && (
              <AddLocation
                handleClose={() => this.handleClose()}
                addCity={city => this.addCity(city)}
              />
            )}
          </div>
        )}
        {!loader && !gpsAvailable && (
          <OtherLocations
            handleAddLocation={() => this.addLocation()}
            celsius={this.state.celsius}
            header="Other Locations"
            handleClick={city => this.handleClick(city)}
          />
        )}
      </div>
    );
  }
}

export default MainScreen;
