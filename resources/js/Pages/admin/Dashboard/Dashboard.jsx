import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Select, Alert } from "antd";
import { formatPrice } from "~/utils/format";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
} from "recharts";

const cx = classNames.bind(styles);
const { Option } = Select;

const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#220066",
    "#FF7700",
    "#00FF77",
    "#FF5733",
    "#C70039",
    "#900C3F",
    "#581845",
    "#1D3557",
    "#F1FAEE",
    "#F4A261",
    "#2A9D8F",
    "#264653",
    "#E9C46A",
    "#F1FAEE",
];

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
        <text
            x={x}
            y={y}
            fill="#333"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            style={{ fontSize: 12, fontWeight: "bold" }}
        >
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};

const Dashboard = () => {
    const [chartData, setChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [timeChartData, setTimeChartData] = useState([]);
    const [timeFrame, setTimeFrame] = useState("daily");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mostSoldProduct, setMostSoldProduct] = useState({});
    const [highestIncomeProduct, setHighestIncomeProduct] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/productlist"
                );
                const products = response.data.products || [];

                const categoryCounts = products.reduce((acc, product) => {
                    const category = product.category_name || "Không xác định";
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});

                const pieData = Object.entries(categoryCounts).map(
                    ([category, value]) => ({ name: category, value })
                );
                setChartData(pieData);

                const revenueByCategory = products.reduce((acc, product) => {
                    const category = product.category_name || "Không xác định";
                    const revenue =
                        product.price * (product.sold_quantity || 1);
                    acc[category] = (acc[category] || 0) + revenue;
                    return acc;
                }, {});

                const barData = Object.entries(revenueByCategory).map(
                    ([category, revenue]) => ({ category, revenue })
                );
                setBarChartData(barData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        const fetchUserCount = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/dashboard/stats"
                );
                const data = response.data?.data;
                if (data) {
                    setTotalUsers(data.total_users);
                    setTotalProductsSold(data.total_sold_products);
                    setTotalPrice(data.total_revenue);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            }
        };

        const fetchRevenueByTime = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/revenue-by-time?time_frame=${timeFrame}`
                );
                const data = response.data.data || [];
                // Chuyển đổi revenue từ chuỗi sang số
                const formattedData = data.map((item) => ({
                    ...item,
                    revenue: parseFloat(item.revenue),
                }));
                setTimeChartData(formattedData);
                setError(null);
            } catch (error) {
                console.error(
                    "Lỗi khi lấy dữ liệu doanh thu theo thời gian:",
                    error
                );
                setTimeChartData([]);
                setError(
                    `Không thể lấy dữ liệu doanh thu: ${
                        error.response?.data?.error || error.message
                    }`
                );
            }
        };

        fetchData();
        fetchUserCount();
        fetchRevenueByTime();
    }, [timeFrame]);

    useEffect(() => {
        const fetchMostSoldProduct = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/product/most-sold"
                );
                const product = response.data?.data;
                if (product) {
                    setMostSoldProduct({
                        name: product.product_name,
                        quantity: product.quantity,
                        price: product.price,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm bán chạy nhất:", error);
            }
        };

        const fetchHighestIncomeProduct = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/product/highest-income"
                );
                const product = response.data?.data;
                if (product) {
                    setHighestIncomeProduct({
                        name: product.product_name,
                        total_price: product.total_price,
                        price: product.price,
                    });
                }
            } catch (error) {
                console.error(
                    "Lỗi khi lấy sản phẩm doanh thu cao nhất:",
                    error
                );
            }
        };

        fetchMostSoldProduct();
        fetchHighestIncomeProduct();
    }, []);

    const handleTimeFrameChange = (value) => {
        setTimeFrame(value);
    };

    return (
        <div className={cx("dashboardContainer")}>
            <h2 className={cx("title")}>Thống kê sản phẩm</h2>

            <Row gutter={[16, 16]}>
                <Col xl={12} sm={24}>
                    <div
                        className={cx("chartBox")}
                        style={{
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Biểu đồ phân bố sản phẩm theo danh mục</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    label={renderCustomizedLabel}
                                    labelLine={{
                                        stroke: "#666",
                                        strokeWidth: 1,
                                    }}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            style={{ outline: "none" }}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                <Col xl={12} sm={24}>
                    <div
                        className={cx("chartBox")}
                        style={{
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Biểu đồ Doanh thu ước tính theo danh mục</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value.toLocaleString()} VND`
                                    }
                                />
                                <RechartsTooltip
                                    formatter={(value) =>
                                        `${value.toLocaleString()} VND`
                                    }
                                />
                                <Legend />
                                <Bar dataKey="revenue" fill="#36A2EB" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xl={24} sm={24}>
                    <div
                        className={cx("chartBox")}
                        style={{
                            marginTop:"20px",
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>
                            Doanh thu theo{" "}
                            {timeFrame === "daily"
                                ? "ngày"
                                : timeFrame === "monthly"
                                ? "tháng"
                                : "năm"}
                        </h3>
                        {error && (
                            <Alert
                                message={error}
                                type="error"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                        {timeChartData.length === 0 && !error && (
                            <Alert
                                message="Không có dữ liệu doanh thu để hiển thị."
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                        <Select
                            defaultValue="daily"
                            style={{ width: 120, marginBottom: 16 }}
                            onChange={handleTimeFrameChange}
                        >
                            <Option value="daily">Theo ngày</Option>
                            <Option value="monthly">Theo tháng</Option>
                            <Option value="yearly">Theo năm</Option>
                        </Select>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={timeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey={
                                        timeFrame === "daily"
                                            ? "date"
                                            : timeFrame === "monthly"
                                            ? "month"
                                            : "year"
                                    }
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value.toLocaleString()} VND`
                                    }
                                />
                                <RechartsTooltip
                                    formatter={(value) =>
                                        `${value.toLocaleString()} VND`
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#FF6384"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={12} sm={24}>
                    <div className={cx("statsBox")}>
                        <div>
                            <h1 className={cx("label")}>Tổng số người dùng:</h1>
                            <h1 className={cx("valueRed")}>{totalUsers}</h1>
                        </div>
                        <div>
                            <h1 className={cx("label")}>
                                Tổng số sản phẩm đã bán:
                            </h1>
                            <h1 className={cx("valueBlue")}>
                                {totalProductsSold}
                            </h1>
                        </div>
                        <div>
                            <h1 className={cx("label")}>Tổng số doanh thu:</h1>
                            <h1 className={cx("valueGreen")}>
                                {formatPrice(totalPrice)}
                            </h1>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className={cx("summaryGrid")}>
                <div className={cx("summaryItem")}>
                    <h1 className={cx("highlight")}>
                        Sản phẩm đặt hàng nhiều nhất
                    </h1>
                    <h1 className={cx("productName")}>
                        {mostSoldProduct.name}
                    </h1>
                    <div className={cx("valueRed")}>
                        Đã bán: {mostSoldProduct.quantity}
                    </div>
                    <h1 className={cx("valueGreen")}>
                        Giá bán: {formatPrice(mostSoldProduct.price)}
                    </h1>
                </div>

                <div className={cx("summaryItem")}>
                    <h1 className={cx("highlight")}>
                        Sản phẩm có doanh thu cao nhất
                    </h1>
                    <h1 className={cx("productName")}>
                        {highestIncomeProduct.name}
                    </h1>
                    <h1 className={cx("valueGreen")}>
                        Doanh thu:{" "}
                        {formatPrice(highestIncomeProduct.total_price)}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
