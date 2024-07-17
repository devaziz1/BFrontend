import {  Select } from 'antd';
import  { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const Statistics = () => {
  const [series] = useState([
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Free Cash Flow",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ]);

  const [options] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  });

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="flex justify-between mx-5 col-span-12 mt-2">
        <h3 className="text-2xl font-semibold">Statistics</h3>
        <Select
          style={{ minWidth: 150 }}
          placeholder="Data"
          options={[
            { value: "Daily", label: "Daily" },
            { value: "Monthly", label: "Monthly" },
            { value: "Yearly", label: "Yearly" },
          ]}
        />
      </div>
      <div id="chart" className="mt-5 col-span-12">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Statistics;

