import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Statistics = () => {
  const [currentGraph, setCurrentGraph] = useState(1);
  const [series, setSeries] = useState([]);

  const getDailyBlogStats = async () => {
    try {
      const config = {
        url: `http://localhost:3000/api/Blog/DailyBlogsStats/${localStorage.getItem(
          "ID"
        )}`,
        method: "GET",
      };

      const response = await axios(config);
      console.log("Blog stats: ", response.data);

      const extractedBlogs = [];
      const extractedLikes = [];
      const extractedComments = [];

      response.data.forEach((item) => {
        extractedBlogs.push(item.totalBlogs);
        extractedLikes.push(item.totalLikes);
        extractedComments.push(item.totalComments);
      });



      setSeries([
        { name: "Blogs", data: extractedBlogs },
        { name: "Likes", data: extractedLikes },
        { name: "Comments", data: extractedComments },
      ]);
    } catch (error) {
      console.error("Error getting daily blog stats:", error);
      // Handle error appropriately
    }
  };

  const getMonthlyBlogStats = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/MonthlyBlogsStats/${localStorage.getItem(
        "ID"
      )}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("Monthly Blog stats: ", response.data);

      // Extract data from response
      const blogs = [];
      const likes = [];
      const comments = [];

      response.data.forEach((item) => {
        const monthIndex = new Date(item._id + "-01").getMonth(); // Extract month index from _id
        blogs[monthIndex] = item.totalBlogs;
        likes[monthIndex] = item.totalLikes;
        comments[monthIndex] = item.totalComments;
      });

      // Fill undefined months with 0
      for (let i = 0; i < 12; i++) {
        if (blogs[i] === undefined) blogs[i] = 0;
        if (likes[i] === undefined) likes[i] = 0;
        if (comments[i] === undefined) comments[i] = 0;
      }

  

      // Update series for monthly data
      setSeries([
        { name: "Blogs", data: blogs },
        { name: "Likes", data: likes },
        { name: "Comments", data: comments },
      ]);
    } catch (error) {
      console.error("Error getting monthly blog stats:", error);
    }
  };

  const getYearlyBlogStats = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/YearlyBlogsStats/${localStorage.getItem(
        "ID"
      )}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("Yearly Blog stats: ", response.data);

      // Extract data from response
      const blogs = new Array(3).fill(0); // assuming data for 3 years: 2022, 2023, 2024
      const likes = new Array(3).fill(0);
      const comments = new Array(3).fill(0);

      response.data.forEach((item) => {
        const yearIndex = parseInt(item._id) - 2022; // Adjust index based on year
        if (yearIndex >= 0 && yearIndex < 3) {
          // Ensure the index is within bounds
          blogs[yearIndex] = item.totalBlogs;
          likes[yearIndex] = item.totalLikes;
          comments[yearIndex] = item.totalComments;
        }
      });

    

      // Update series for yearly data
      setSeries([
        { name: "Blogs", data: blogs },
        { name: "Likes", data: likes },
        { name: "Comments", data: comments },
      ]);
    } catch (error) {
      console.error("Error getting yearly blog stats:", error);
    }
  };

  const [options1] = useState({
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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



  const [options2] = useState({
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
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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



  const [options3] = useState({
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
      categories: ["2022", "2023", "2024"],
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

  const handleSelectChange = (value) => {
    if (value === "Daily") {
      setCurrentGraph(1);
    } else if (value === "Monthly") {
      setCurrentGraph(2);
      getMonthlyBlogStats();
    } else if (value === "Yearly") {
      setCurrentGraph(3);
      getYearlyBlogStats();
    }
  };



  useEffect(() => {
    getDailyBlogStats();
  }, []);

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="flex justify-between mx-5 col-span-12 mt-2">
        <h3 className="text-2xl font-semibold">Statistics</h3>
        <Select
          style={{ minWidth: 150 }}
          placeholder="Data"
          onChange={handleSelectChange}
          options={[
            { value: "Daily", label: "Daily" },
            { value: "Monthly", label: "Monthly" },
            { value: "Yearly", label: "Yearly" },
          ]}
        />
      </div>
      <div id="chart" className="mt-5 col-span-12">
        {currentGraph === 1 ? (
          <ReactApexChart
            options={options1}
            series={series}
            type="bar"
            height={350}
          />
        ) : currentGraph === 2 ? (
          <ReactApexChart
            options={options2}
            series={series}
            type="bar"
            height={350}
          />
        ) : (
          <ReactApexChart
            options={options3}
            series={series}
            type="bar"
            height={350}
          />
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Statistics;
