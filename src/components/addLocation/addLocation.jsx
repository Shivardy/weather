import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapSigns, faTimes } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "./addLocation.css";
import axios from "axios";
library.add(faMapSigns, faTimes);
class AddLocation extends Component {
  state = {
    inputValue: "",
    cities: null,
    submitted: false
  };
  changeValue(e) {
    this.setState({ inputValue: e.target.value });
  }
  async getCities(e) {
    e.preventDefault();
    this.setState({ submitted: true, cities: null });

    const searchTerm = this.state.inputValue;
    const url = `${process.env.REACT_APP_SEARCHCITY}${searchTerm}`;
    const { data } = await axios.get(url);
    this.setState({ cities: data, submitted: false });
  }

  render() {
    let { cities, submitted } = this.state;
    return (
      <div className="addlocation">
        <div className="headingSection">
          <div>
            <p className="header">
              <FontAwesomeIcon icon="map-signs" /> Add New Location
            </p>
            <p className="subheading">Find a city and tap on it to add</p>
          </div>
          <div>
            <FontAwesomeIcon
              icon="times"
              className="close"
              onClick={() => this.props.handleClose()}
            />
          </div>
        </div>
        <form onSubmit={e => this.getCities(e)}>
          <input
            className="searchBox"
            placeholder="Start typing here"
            onChange={e => this.changeValue(e)}
            value={this.state.inputValue}
          />
        </form>
        {cities && (
          <div>
            {cities.map(city => (
              <div
                key={city.id}
                className="listItem"
                onClick={() => this.props.addCity(city)}
              >
                <p>{city.name}</p>
                <h5>{city.country}</h5>
              </div>
            ))}
          </div>
        )}
        {submitted && (
          <img src="/static/loader.svg" alt="Please Wait" className="loader" />
        )}
      </div>
    );
  }
}

export default AddLocation;
