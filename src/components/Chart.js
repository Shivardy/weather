import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.chartData !== prevProps.chartData) {
      this.setState({ chartData: this.props.chartData });
    }
  }
  render() {
    return (
      <div className="chart">
        <Line
          height={120}
          data={this.state.chartData}
          options={{
            layout: {
              padding: {
                top: 25,
                bottom: 5
              }
            },
            plugins: {
              datalabels: {
                align: "top",
                color: "#404244",
                offset: 5
              }
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ],
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  ticks: {
                    display: false
                  }
                }
              ]
            },

            legend: {
              display: false
            }
          }}
        />
      </div>
    );
  }
}

export default Chart;
