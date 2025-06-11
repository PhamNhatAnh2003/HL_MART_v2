import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames/bind";
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
import Dropdown from "@/components/Dropdown";

const cx = classNames.bind(styles);

const PredictProduct = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/productlist"
                );
                setProducts(res.data.products);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    const parseBacktestData = (backtestArray) => {
        return backtestArray
            .map((line) => {
                const match = line.match(
                    /(\d{4})-(\d{2})\s*\|\s*RF:\s*([\d.]+)\s*\|\s*XGB:\s*([\d.]+)/
                );
                if (!match) return null;
                const [, year, month, rf, xgb] = match;
                const rfNum = parseFloat(rf);
                const xgbNum = parseFloat(xgb);
                return {
                    name: `${parseInt(month)}/${year}`,
                    predicted_rf_bt: rfNum,
                    predicted_xgb_bt: xgbNum,
                    avg_predicted_bt: (rfNum + xgbNum) / 2,
                };
            })
            .filter(Boolean);
    };

    const handlePredict = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `http://127.0.0.1:5000/predict/${selectedProduct}`
            );
            console.log(res.data)
            setDatas(res.data.next_month_prediction);
            const history = res.data.monthly_quantity_sold.map((item) => ({
                name: `${item.month}/${item.year}`,
                quantity_sold: item.total_quantity_sold,
            }));

            const backtest = parseBacktestData(res.data.backtest_predictions);

            const merged = history.map((h, i) => ({
                ...h,
                ...(backtest[i] || {}),
            }));

            const next = res.data.next_month_prediction;
            const nextPoint = {
                name: `${next.month}/${next.year}`,
                quantity_sold: null,
                predicted_rf: next.predicted_quantity_sold_random_forest,
                predicted_xgb: next.predicted_quantity_sold_xgboost,
                avg_predicted:
                    (next.predicted_quantity_sold_random_forest +
                        next.predicted_quantity_sold_xgboost) /
                    2,
            };

            const fullChartData = [...merged, nextPoint];

            setResult({
                ...res.data,
                chartData: fullChartData,
            });
        } catch (err) {
            setError(err.response?.data?.error || "Đã có lỗi xảy ra.");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx("container")}>
            <h2 className={cx("title")}>Dự đoán số lượng bán sản phẩm</h2>

            <div className={cx("dropdownWrapper")}>
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
                className={cx("button")}
            >
                {loading ? "Đang dự đoán..." : "Dự đoán"}
            </Button>

            {error && <p className={cx("error")}>{error}</p>}

            {result && (
                <div className={cx("resultBox")}>
                    <div className={cx("details")}>
                        <p>
                            <strong>Tổng dữ liệu:</strong>{" "}
                            {result.chartData.length} tháng
                        </p>
                    </div>

                    {result.chartData.length > 0 && (
                        <>
                            {result.chartData[result.chartData.length - 1]
                                .quantity_sold === null && (
                                <div className={cx("note")}>
                                    Dòng cuối là dự đoán cho tháng kế tiếp:{" "}
                                    <strong>
                                        {
                                            result.chartData[
                                                result.chartData.length - 1
                                            ].name
                                        }
                                    </strong>
                                </div>
                            )}

                            <div className={cx("chartSection")}>
                                <h2> Biểu đồ dự đoán trực quan</h2>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart
                                        data={result.chartData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 30,
                                            bottom: 10,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" interval={0} />
                                        <YAxis
                                            padding={{ top: 30, bottom: 30 }}
                                            domain={["auto", "auto"]}
                                        />
                                        <Tooltip />
                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="quantity_sold"
                                            name="Thực tế"
                                            stroke="#007bff"
                                            strokeWidth={2}
                                            dot={({ payload, cx, cy }) =>
                                                payload.quantity_sold !==
                                                null ? (
                                                    <circle
                                                        key={`dot-${payload.name}`}
                                                        cx={cx}
                                                        cy={cy}
                                                        r={4}
                                                        fill="#007bff"
                                                    />
                                                ) : null
                                            }
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avg_predicted_bt"
                                            name="Dự đoán"
                                            stroke="#f39c12"
                                            strokeDasharray="4 2"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avg_predicted"
                                            name="Dự đoán (Tháng tới)"
                                            stroke="#f39c12"
                                            strokeDasharray="1 1"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                    <div className={cx("details")}>
                        <p>
                            <strong>Dự đoán cho tháng:</strong> {datas.month}
                        </p>
                        <p>
                            <strong>
                                Kết quả dự đoán theo mô hình Random-Forest:{" "}
                            </strong>
                            {datas.predicted_quantity_sold_random_forest}
                        </p>
                        <p>
                            <strong>
                                Kết quả dự đoán theo mô hình XGBoost:{" "}
                            </strong>
                            {datas.predicted_quantity_sold_xgboost}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default PredictProduct;
