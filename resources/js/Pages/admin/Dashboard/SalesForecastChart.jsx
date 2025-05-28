import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesForecastChart = ({ history, forecast_next_day_sales }) => {

    // Nếu history rỗng, chỉ hiển thị 1 cột forecast
    if (!history || history.length === 0) {
        const forecastValue =
            isNaN(Number(forecast_next_day_sales)) ||
            forecast_next_day_sales < 0
                ? 0
                : Number(forecast_next_day_sales);

        const data = {
            labels: ["Dự báo ngày kế tiếp"],
            datasets: [
                {
                    label: "Dự đoán số sản phẩm bán ra",
                    data: [forecastValue],
                    backgroundColor: ["#8e5ea2"],
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: {
                    display: true,
                    text: "Biểu đồ doanh số bán hàng và dự báo",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 5,
                },
            },
        };

        return <Bar data={data} options={options} />;
    }

    // Nếu history có dữ liệu
    const labels = history.map((h) => h.date);
    const dataValues = history.map((h) => {
        const val = Number(h.total_sold);
        return isNaN(val) || val < 0 ? 0 : val;
    });

    const lastDate = new Date(labels[labels.length - 1]);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split("T")[0];

    const forecastValue =
        isNaN(Number(forecast_next_day_sales)) || forecast_next_day_sales < 0
            ? 0
            : Number(forecast_next_day_sales);

    const allLabels = [...labels, `${nextDateStr} (Dự đoán)`];
    const allData = [...dataValues, forecastValue];

    const data = {
        labels: allLabels,
        datasets: [
            {
                label: "Dự đoán số sản phẩm bán ra",
                data: allData,
                backgroundColor: allLabels.map((label, idx) =>
                    idx === allLabels.length - 1 ? "#8e5ea2" : "#3e95cd"
                ),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Biểu đồ doanh số bán hàng và dự báo",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 5,
            },
        },
    };

    return (
        <div
            style={{
                marginLeft: "8px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            <Bar data={data} options={options} />
        </div>
    );


};

export default SalesForecastChart;
