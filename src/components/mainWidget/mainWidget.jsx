import React, { Component } from "react";
import axios from "axios";
import Chart from "../Chart";
import timeConvert from "../../utils/timeConvert";
import tempConvert from "../../utils/tempConvert";
import WeeklyForecast from "../weeklyForecast/weeklyForecast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "./mainWidget.css";
library.add(faMapMarkerAlt);
class MainWidget extends Component {
  state = {};
  componentDidMount() {
    this.setState({ ...this.props.data });
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({ ...this.props.data });
    }
  }

  getDegree(celsius) {
    if (celsius) return <sup>&#8451; </sup>;
    else return <sup> &#8457;</sup>;
  }
  handleDegree(celsius) {
    let c = !celsius;
    this.setState({ celsius: c });
    this.props.celsiusChanged(c);
  }
  getDegreeButtons(celsius) {
    if (celsius)
      return (
        <sup>
          &#8451; |
          <a
            className="degreebutton"
            onClick={() => this.handleDegree(celsius)}
          >
            &#8457;
          </a>
        </sup>
      );
    else
      return (
        <sup>
          <a
            className="degreebutton"
            onClick={() => this.handleDegree(celsius)}
          >
            &#8451;
          </a>{" "}
          | &#8457;
        </sup>
      );
  }
  getDailyData(data) {
    let timestamp = data.time;
    timestamp = timeConvert(timestamp, true);
    let day = timestamp[1];
    let date = timestamp[0];
    let icon = data.icon;
    let maxtemp = this.state.celsius
      ? tempConvert(data.temperatureMax)
      : Math.round(data.temperatureMax);
    let mintemp = this.state.celsius
      ? tempConvert(data.temperatureMin)
      : Math.round(data.temperatureMin);
    return [data.time, date, day, icon, maxtemp, mintemp];
  }
  forecast(timestamp) {
    const { lat, lon } = this.state;
    let url = `${process.env.REACT_APP_FORECAST}${lat}/${lon}/${timestamp}`;
    return axios.get(url);
  }
  async dayChanged(ts) {
    let { data } = this.state.daily;
    data = data.filter(i => i.time === ts);
    const { data: res } = await this.forecast(ts);
    let humidity = res.currently.humidity;
    let windSpeed = res.currently.windSpeed;
    let visibility = res.currently.visibility;
    let uvIndex = res.currently.uvIndex;
    let timestamp = timeConvert(res.currently.time);
    let feelsLike = res.currently.apparentTemperature;
    let temp = res.currently.temperature;
    let desc = res.currently.summary;
    let icon = data[0].icon;
    let hourly = res.hourly;
    let high_temp = data[0].temperatureMax;
    let low_temp = data[0].temperatureMin;
    let sunrise = data[0].sunriseTime;
    let sunset = data[0].sunsetTime;
    this.setState({
      humidity,
      windSpeed,
      visibility,
      uvIndex,
      timestamp,
      feelsLike,
      temp,
      desc,
      icon,
      hourly,
      high_temp,
      low_temp,
      sunrise,
      sunset
    });
  }
  render() {
    let {
      humidity,
      windSpeed,
      visibility,
      uvIndex,
      timestamp,
      feelsLike,
      temp,
      desc,
      icon,
      sunrise,
      sunset,
      high_temp,
      low_temp,
      celsius,
      name,
      country,
      hourly,
      daily,
      header
    } = this.state;

    let graphLabels = [],
      graphData = [],
      chartData;
    if (hourly) {
      hourly = hourly.data;
      let length = hourly.length > 24 ? hourly.length / 2 : hourly.length;
      for (let i = 0; i < length; i = i + 2) {
        let time = timeConvert(hourly[i].time)[3];
        let index = time.indexOf(":");
        time = time.slice(0, index) + time.slice(index + 3, time.length);
        graphLabels.push(time);
        if (celsius) graphData.push(tempConvert(hourly[i].temperature));
        else graphData.push(Math.round(hourly[i].temperature));
      }
      chartData = {
        labels: graphLabels,
        datasets: [
          {
            data: graphData
          }
        ]
      };
    }

    sunrise = timeConvert(sunrise)[3];
    sunset = timeConvert(sunset)[3];
    let max_temp = celsius ? tempConvert(high_temp) : Math.round(high_temp);
    let min_temp = celsius ? tempConvert(low_temp) : Math.round(low_temp);
    let day, date, time;
    if (timestamp) {
      day = timestamp[1];
      date = timestamp[0];
      time = timestamp[3];
    }

    feelsLike = celsius ? tempConvert(feelsLike) : Math.round(feelsLike);
    temp = celsius ? tempConvert(temp) : Math.round(temp);

    if (daily) {
      daily = daily.data;
      daily = daily.map(i => this.getDailyData(i));
    }

    return (
      <div>
        <p className="header">
          <FontAwesomeIcon icon="map-marker-alt" /> {header}
        </p>
        <div className="mainCard">
          <div>
            <h1>{`${name}, ${country}`}</h1>
            <h3>{`${date}, ${day}, ${time}`}</h3>
            <h3>{desc}</h3>
            <h3>
              Feels Like:{" "}
              <b>
                {`${feelsLike}`}
                {this.getDegree(celsius)}
              </b>
            </h3>
            <div className="temp">
              <img src={`/static/icons/${icon}.svg`} alt="Weather Icon" />
              <div>
                {temp}
                {this.getDegreeButtons(celsius)}
              </div>
            </div>

            <div className="moreinfo">
              <h4>
                High:{" "}
                <b>
                  {`${max_temp}`}
                  {this.getDegree(celsius)}
                </b>
              </h4>
              <h4>
                Low:{" "}
                <b>
                  {`${min_temp}`}
                  {this.getDegree(celsius)}
                </b>
              </h4>

              <h4>
                Sunrise: <b>{`${sunrise}`}</b>
              </h4>
              <h4>
                Sunset: <b>{`${sunset}`}</b>
              </h4>

              <h4>
                Humidity: <b>{`${Math.round(humidity * 100)}%`}</b>
              </h4>
              <h4>
                Wind: <b>{`${windSpeed} kmph`}</b>
              </h4>

              <h4>
                Visibility: <b>{`${visibility} miles`}</b>
              </h4>
              <h4>
                UV Index: <b>{`${uvIndex}`}</b>
              </h4>
            </div>
            {chartData && <Chart chartData={chartData} />}
            {daily && (
              <WeeklyForecast
                data={daily}
                date={date}
                dayChanged={timestamp => this.dayChanged(timestamp)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MainWidget;
