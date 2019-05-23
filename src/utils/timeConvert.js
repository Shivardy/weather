const timeConvert = (time, short) => {
  let timeStamp = new Date(0);
  timeStamp.setUTCSeconds(time);
  const days = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let date = timeStamp.getDate();
  let day = days[timeStamp.getDay()];
  let month = months[timeStamp.getMonth()];
  let hours = timeStamp.getHours();
  let minutes = timeStamp.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return [date, day, month, strTime];
};

export default timeConvert;
