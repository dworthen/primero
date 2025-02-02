import Box from "@material-ui/core/Box";
import Chart from "chart.js";
import { createRef, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const BarChart = ({ data, description, showDetails }) => {
  const css = useStyles();
  const chartRef = createRef();

  useEffect(() => {
    const chatCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    const chartInstance = new Chart(chatCtx, {
      type: "bar",
      data,
      options: {
        responsive: true,
        animation: {
          duration: 0
        },
        maintainAspectRatio: false,
        legend: {
          display: showDetails
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const { label } = chartData.datasets[tooltipItem.datasetIndex];
              let { value } = tooltipItem;

              if (value === "0.1") {
                value = "0";
              }

              return `${label}: ${value}`;
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: showDetails,
              ticks: {
                beginAtZero: true,
                min: 0,
                suggestedMin: 0
              }
            }
          ],
          xAxes: [
            {
              display: showDetails,
              min: 0,
              suggestedMin: 0,
              ticks: {
                callback: value => {
                  if (value?.length > 25) {
                    return value.substr(0, 25).concat("...");
                  }

                  return value;
                }
              }
            }
          ]
        }
      }
    });

    return () => {
      chartInstance.destroy();
    };
  });

  return (
    <Box>
      {!showDetails ? <p className={css.description}>{description}</p> : null}
      <canvas id="reportGraph" ref={chartRef} height={!showDetails ? null : 400} />
    </Box>
  );
};

BarChart.displayName = "BarChart";

BarChart.defaultProps = {
  showDetails: false
};

BarChart.propTypes = {
  data: PropTypes.object,
  description: PropTypes.string,
  showDetails: PropTypes.bool
};

export default BarChart;
