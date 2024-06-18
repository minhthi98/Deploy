import React, { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import { Bar, Line, PolarArea } from "react-chartjs-2";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AxiosInstance from "../../../../utils/AxiosInstance";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const cx = classNames.bind(styles);

function Home() {
  const [yumhubData, setYumhubData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [foodData, setFoodData] = useState({});
  const [profitData, setProfitData] = useState({});
  const [merchantsData, setMerchantsData] = useState({});
  const [shippersData, setShippersData] = useState({});
  const [shipData, setShipData] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const month = formatDate(startDate);
        
        const response = await AxiosInstance.get(
          `orders/revenueFoodDelivery?month=${month}`
        );
        const DATA = response.data;

        if (DATA.thisMonth && DATA.lastMonth && DATA.twoMonthAgos) {
          setYumhubData({
            revenue: DATA.thisMonth.totalRevenue,
            food: DATA.thisMonth.totalFood,
            ship: DATA.thisMonth.totalShip,
            profitMerchant: DATA.thisMonth.totalMerchant,
            profitShipper: DATA.thisMonth.totalShipper,
            vocher: DATA.thisMonth.totalVoucher,
            profit:
              (DATA.thisMonth.totalRevenue || 0) -
              ((DATA.thisMonth.totalShipper || 0) +
                (DATA.thisMonth.totalMerchant || 0)),
          });

          setRevenueData({
            thisMonth: DATA.thisMonth.totalRevenue || 0,
            lastMonth: DATA.lastMonth.totalRevenue || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalRevenue || 0,
          });

          setFoodData({
            thisMonth: DATA.thisMonth.totalFood || 0,
            lastMonth: DATA.lastMonth.totalFood || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalFood || 0,
          });

          setProfitData({
            thisMonth:
              (DATA.thisMonth.totalRevenue || 0) -
              ((DATA.thisMonth.totalShipper || 0) +
                (DATA.thisMonth.totalMerchant || 0)),
            lastMonth:
              (DATA.lastMonth.totalRevenue || 0) -
              ((DATA.lastMonth.totalShipper || 0) +
                (DATA.lastMonth.totalMerchant || 0)),
            twoMonthsAgo:
              (DATA.twoMonthAgos.totalRevenue || 0) -
              ((DATA.twoMonthAgos.totalShipper || 0) +
                (DATA.twoMonthAgos.totalMerchant || 0)),
          });

          setMerchantsData({
            thisMonth: DATA.thisMonth.totalMerchant || 0,
            lastMonth: DATA.lastMonth.totalMerchant || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalMerchant || 0,
          });

          setShippersData({
            thisMonth: DATA.thisMonth.totalShipper || 0,
            lastMonth: DATA.lastMonth.totalShipper || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalShipper || 0,
          });

          setShipData({
            thisMonth: DATA.thisMonth.totalShip || 0,
            lastMonth: DATA.lastMonth.totalShip || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalShip || 0,
          });
        } else {
          console.log("Some data properties are missing in the API response.");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate]);

  const currentDate = new Date();
  const labels = Array.from({ length: 3 }, (_, i) => {
    const date = subMonths(currentDate, i);
    return format(date, "MMMM yyyy");
  }).reverse();

  const totalYumHub = {
    labels: [
      "Revenue",
      "Profit",
      "Food",
      "Ship",
      "Voucher",
      "Merchant",
      "Shipper",
    ],
    datasets: [
      {
        label: "YumHub Chart",
        data: [
          yumhubData?.revenue || 0,
          yumhubData?.profit || 0,
          yumhubData?.food || 0,
          yumhubData?.ship || 0,
          yumhubData?.vocher || 0,
          yumhubData?.profitMerchant || 0,
          yumhubData?.profitShipper || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Revenue Chart",
        data: [
          revenueData?.twoMonthsAgo || 0,
          revenueData?.lastMonth || 0,
          revenueData?.thisMonth || 0,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const foodDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Food Chart",
        data: [
          foodData?.twoMonthsAgo || 0,
          foodData?.lastMonth || 0,
          foodData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const shipDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Ship Chart",
        data: [
          shipData?.twoMonthsAgo || 0,
          shipData?.lastMonth || 0,
          shipData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const profitDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Profit Chart",
        data: [
          profitData?.twoMonthsAgo || 0,
          profitData?.lastMonth || 0,
          profitData?.thisMonth || 0,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const merchantDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Merchant Chart",
        data: [
          merchantsData?.twoMonthsAgo || 0,
          merchantsData?.lastMonth || 0,
          merchantsData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const shipperDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Shipper Chart",
        data: [
          shippersData?.twoMonthsAgo || 0,
          shippersData?.lastMonth || 0,
          shippersData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={cx("container")}>
      <div className={cx("wrapper-date-picker")}>
        <p className={cx("title-date-picker")}>Select Date:</p>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/dd/yyyy"
          className={cx("customDatePicker")}
        />
      </div>
      <div className={cx("yumhub-chart-wrapper")}>
        <Bar
          className={cx("yumhub-chart")}
          data={totalYumHub}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "YumHub Chart",
                font: {
                  size: 20,
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <Line
          className={cx("box-chart")}
          data={revenueDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Revenue Chart",
                font: {
                  size: 20,
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
        <div className={cx("line")} />
        <Line
          className={cx("box-chart")}
          data={profitDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Profit Chart",
                font: {
                  size: 20,
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <Bar
          className={cx("box-chart")}
          data={merchantDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: true, text: "" },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
        <div className={cx("line")} />
        <Bar
          className={cx("box-chart")}
          data={shipperDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: true, text: "" },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <PolarArea
          className={cx("box-chart")}
          data={shipDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Ship Chart",
                font: {
                  size: 20,
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: {
              r: {
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
        <div className={cx("line")} />
        <PolarArea
          className={cx("box-chart")}
          data={foodDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Food Chart",
                font: {
                  size: 20,
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: {
              r: {
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Home;
