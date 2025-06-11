import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PredictProduct.module.scss";
import Button from "~/components/Button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import Dropdown from "@/components/Dropdown"; // Cập nhật đường dẫn nếu khác

const PredictProduct = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/productlist"
                );
                console.log(res.data.products)
                setProducts(res.data.products);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    const handlePredict = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `http://127.0.0.1:5000/predict/${selectedProduct}`
            );
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Đã có lỗi xảy ra.");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const chartData =
        result?.history?.map((item) => ({
            name: `${item.month}/${item.year}`,
            sold: item.sold,
        })) || [];

    if (result?.next_month_prediction) {
        chartData.push({
            name: `${result.next_month_prediction.month}/${result.next_month_prediction.year}`,
            sold: null,
            predicted: (
                (result.next_month_prediction
                    .predicted_quantity_sold_random_forest +
                    result.next_month_prediction
                        .predicted_quantity_sold_xgboost) /
                2
            ).toFixed(2),
        });
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>📈 Dự đoán số lượng bán sản phẩm</h2>

            <div className={styles.dropdownWrapper}>
                <Dropdown
                    id="Product"
                    label="Dự báo số lượng sản phẩm bán ra"
                    title="Chọn Sản Phẩm"
                    selected={
                        products.find((p) => p.id === selectedProduct)?.name ||
                        "Chưa chọn sản phẩm"
                    }
                    setValue={(value) => {
                        const selected = products.find((p) => p.name === value);
                        if (selected) setSelectedProduct(selected.id);
                    }}
                    width="100%"
                >
                    {products.map((option) => (
                        <div key={option.id}>{option.name}</div>
                    ))}
                </Dropdown>
            </div>

            <Button
                onClick={handlePredict}
                disabled={!selectedProduct || loading}
                className={styles.button}
            >
                {loading ? "Đang dự đoán..." : "Dự đoán"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {result && (
                <div className={styles.resultBox}>
                    <div className={styles.details}>
                        <p>
                            <strong>📦 Product ID:</strong> {result.product_id}
                        </p>
                        <p>
                            <strong>📅 Tháng:</strong>{" "}
                            {result.next_month_prediction.month}/
                            {result.next_month_prediction.year}
                        </p>
                        <p>
                            <strong>🌲 Random Forest:</strong>{" "}
                            {
                                result.next_month_prediction
                                    .predicted_quantity_sold_random_forest
                            }
                        </p>
                        <p>
                            <strong>🚀 XGBoost:</strong>{" "}
                            {
                                result.next_month_prediction
                                    .predicted_quantity_sold_xgboost
                            }
                        </p>
                        <p className={styles.average}>
                            📊 Trung bình:{" "}
                            {(
                                (result.next_month_prediction
                                    .predicted_quantity_sold_random_forest +
                                    result.next_month_prediction
                                        .predicted_quantity_sold_xgboost) /
                                2
                            ).toFixed(2)}
                        </p>
                    </div>

                    {chartData.length > 0 && (
                        <div className={styles.chartSection}>
                            <h3>📉 Lịch sử số lượng bán theo tháng</h3>
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 30,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        type="category"
                                        interval="preserveStartEnd"
                                        tick={{ fontSize: 12 }}
                                        padding={{ left: 40, right: 40 }}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="sold"
                                        name="Số lượng đã bán"
                                        stroke="#007bff"
                                        strokeWidth={2}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="predicted"
                                        name="Dự đoán tháng tới"
                                        stroke="#28a745"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PredictProduct;
