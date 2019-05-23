import React, { Component } from "react";
import "./otherLocations.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import OtherLocationListItem from "../otherLocationListItem/otherLocationListItem";
library.add(faPlus, faMapMarkedAlt);
class OtherLocations extends Component {
  state = {};
  async componentDidMount() {
    let locations = [];
    for (let i = 0; i < localStorage.length; ++i) {
      const location = JSON.parse(localStorage.getItem(localStorage.key(i)));
      const url = `${process.env.REACT_APP_GETCURRENT}${location.id}`;
      let { data } = await axios.get(url);
      data = { ...data, ...location };
      locations.push(data);
    }
    this.setState({ locations, header: this.props });
  }
  deleteCity(city) {
    let { locations } = this.state;
    locations = locations.filter(c => c.id !== city.id);
    localStorage.removeItem(city.id);
    this.setState({ locations });
  }
  render() {
    const { locations } = this.state;
    const { header } = this.props;
    return (
      <div className="otherLocations">
        <p className="header">
          <FontAwesomeIcon icon="map-marked-alt" /> {header}
        </p>
        {!locations && (
          <p className="lead">
            You have no saved cities. Click the button below to add them!
          </p>
        )}
        {locations &&
          locations.map(city => (
            <OtherLocationListItem
              city={city}
              key={city.id}
              celsius={this.props.celsius}
              deleteCity={city => this.deleteCity(city)}
              handleClick={city => this.props.handleClick(city)}
            />
          ))}
        <p
          className="addLocation"
          onClick={() => this.props.handleAddLocation()}
        >
          <FontAwesomeIcon icon="plus" />
        </p>
      </div>
    );
  }
}

export default OtherLocations;
