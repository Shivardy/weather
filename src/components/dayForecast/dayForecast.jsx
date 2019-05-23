import React from "react";
import "./dayForecast.css";

const DayForecast = props => {
  const { data, date } = props;
  return (
    <div
      className={data[1] === date ? "dayForecast active" : "dayForecast"}
      onClick={() => props.dayChanged(data[0])}
    >
      <h5>{data[2]}</h5>
      <img src={`/static/icons/${data[3]}.svg`} alt="Weather Icon" />
      <div className="temperature">
        <h6>{data[4]}&deg;</h6>
        <h6>{data[5]}&deg;</h6>
      </div>
    </div>
  );
};

export default DayForecast;
