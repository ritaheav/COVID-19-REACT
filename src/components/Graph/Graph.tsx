import React, { useEffect, useState } from "react";
import style from "./Graph.module.scss";
import { Bar, Line } from "react-chartjs-2";
import { ICovidData } from "../../model";
import { ICountryGraph, IOdjectChart } from "../../model/graph.model";
import { updateChart } from "../../services/graph.services";
import { Spinner } from "../Spinner/Spinner";

interface Props {
  data: ICovidData;
  objChart: IOdjectChart;
  checked: boolean;
  response: ICountryGraph;
  isWord: boolean;
  chartContainer: { current: Bar | Line };
  daily: boolean;
  isLoading: boolean;
  country: { country: string; population: number };
}

const Graph: React.FC<Props> = ({
  country,
  data,
  objChart,
  checked,
  response,
  isLoading,
  isWord,
  chartContainer,
  daily,
}) => {
  const datas: any = {
    labels: [],
    datasets: [
      {
        barPercentage: 1,
        minBarLength: 1,
        categoryPercentage: 1,
        data: [],
        fill: false,
        backgroundColor: "#d21a1a",
        borderColor: "#d21a1a",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          color: "white",
          type: "time",
          position: "bottom",
          time: {
            tooltipFormat: "ll",
            units: "month",
            displayFormats: {
              month: "MMM",
            },
          },
        },
      ],
      yAxes: [
        {
          color: "white",
          type: "linear",
          ticks: {
            beginAtZero: true,

            callback: function (label: number) {
              if (Math.floor(label) === label) {
                return label >= 1000000
                  ? label / 1000000 + "M"
                  : label >= 1000
                  ? label / 1000 + "K"
                  : label;
              }
            },
          },
        },
      ],
    },
  };
  const [dataChart] = useState<any>(datas);
  const [optionChart] = useState<any>(options);

  useEffect(() => {
    if (response && !isLoading && !response.message) {
      const worlPopulation = 7827000000;
      updateChart(
        isWord ? response[objChart.cases] : response.timeline[objChart.cases],
        chartContainer,
        objChart.daily,
        objChart.type,
        checked,
        objChart.color,
        isWord ? worlPopulation : country.population
      );
    }
  }, [response, checked, objChart, isLoading]);

  return (
    <div className={style.container}>
      {!response || isLoading ? (
        <Spinner />
      ) : response.message ? (
        <h3 className={style.message}>{response.message}</h3>
      ) : objChart.daily ? (
        <Bar
          data={dataChart}
          options={optionChart}
          ref={chartContainer}
          redraw
        />
      ) : (
        <Line
          data={dataChart}
          options={optionChart}
          ref={chartContainer}
          redraw
        />
      )}
    </div>
  );
};

export default Graph;
