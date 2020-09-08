import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

import './LineGraph.css';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          format: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://www.disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then((res) => res.json())
      .then((data) => {
        setData(buildChartData(data, casesType));
      });
  }, [casesType]);

  const buildChartData = (data, casesType = 'cases') => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  return (
    <div className="lineGraph">
      {data.length && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: `${
                  casesType !== 'recovered'
                    ? 'rgba(204, 16, 52, 0.5)'
                    : '#98D592'
                }`,
                borderColor: `${
                  casesType !== 'recovered' ? '#cc1034' : '#82D730'
                }`,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
