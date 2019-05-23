import React, { Component } from "react";
import "./otherLocationListItem.css";
import tempConvert from "../../utils/tempConvert";
import timeConvert from "../../utils/timeConvert";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faTimes);

class OtherLocationListItem extends Component {
  state = { showCross: false };
  handleMouseEnter() {
    this.setState({ showCross: true });
  }
  handelMouseLeave() {
    this.setState({ showCross: false });
  }
  getTemp(temp) {
    return this.props.celsius ? tempConvert(temp) : temp;
  }

  render() {
    const { city } = this.props;
    const { showCross } = this.state;
    return (
      <div
        className="listItems"
        onMouseEnter={() => this.handleMouseEnter()}
        onMouseLeave={() => this.handelMouseLeave()}
      >
        <div className="headingSection">
          <p className="heading" onClick={() => this.props.handleClick(city)}>
            {city.name}, {city.country}{" "}
          </p>
          {city.id && (
            <div className="delete" onClick={() => this.props.deleteCity(city)}>
              {showCross && <FontAwesomeIcon icon="times" />}
            </div>
          )}
        </div>

        <div className="listItemWeather">
          <div className="iconbox">
            <img src={`/static/icons/${city.icon}.svg`} alt="Weather Icon" />
            <div className="desc">
              <h4>{city.desc}</h4>
              <h6>
                {this.getTemp(city.maxTemp)}&deg; {this.getTemp(city.minTemp)}
                &deg;
              </h6>
            </div>
          </div>
          <h1>{this.getTemp(city.temp)}&deg;</h1>
          <div className="sunTime">
            <div className="sunTime_">
              <img src={`/static/icons/sunrise.svg`} alt="Weather Icon" />
              <h5> {timeConvert(city.sunrise)[3]}</h5>
            </div>
            <div className="sunTime_">
              <img src={`/static/icons/sunset.svg`} alt="Weather Icon" />
              <h5> {timeConvert(city.sunset)[3]}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OtherLocationListItem;
