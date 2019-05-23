import React from "react";
import DayForecast from "../dayForecast/dayForecast";
import "./weeklyForecast.css";
const WeeklyForecast = props => {
  let { date } = props;
  return (
    <div className="weeklyForecast">
      {props.data.map(data => (
        <DayForecast
          data={data}
          date={date}
          dayChanged={timestamp => props.dayChanged(timestamp)}
          key={data[0]}
        />
      ))}
    </div>
  );
};

export default WeeklyForecast;
