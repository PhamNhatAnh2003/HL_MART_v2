import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Col, Row } from "antd";
// import { formatCash } from "../utils/formatCash";
import styles from "./Dashboard.module.scss"


const Dashboard = () => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [chartData, setChartData] = useState({});
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [mostSoldProduct, setMostSoldProduct] = useState({});
    const [highestIncomeProduct, setHighestIncomeProduct] = useState({});
    const [mostSoldCategory, setMostSoldCategory] = useState({});


   useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      console.log('Phản hồi API:', response.data); // Kiểm tra lại cấu trúc của phản hồi

      const products = response.data.products.data; // Đảm bảo bạn truy cập đúng nơi chứa mảng sản phẩm
      if (!products || products.length === 0) {
        console.error('Không có dữ liệu sản phẩm');
        return; // Dừng thực thi nếu không có dữ liệu sản phẩm
      }

      const categoryCounts = products.reduce((acc, product) => {
        const category = product.category_id || 'Không xác định'; // Thêm kiểm tra nếu không có category_name
        if (!acc[category]) acc[category] = 0;
        acc[category]++;
        return acc;
      }, {});

      const mostSoldCategory = Object.entries(categoryCounts).reduce(
        (max, [category, count]) =>
          count > max.count ? { category, count } : max,
        { category: "Không xác định", count: 0 } // Mặc định là "Không xác định" nếu không có category
      );

      console.log('Most Sold Category:', mostSoldCategory); // Kiểm tra giá trị category

      const data = {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            data: Object.values(categoryCounts),
            backgroundColor: [
              "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
              "#FF9F40", "#220066", "#FF7700", "#00FF77"
            ],
          },
        ],
      };

      setChartData(data); // Lưu dữ liệu biểu đồ vào state
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
  };


        // const fetchUserCount = async () => {
        //     try {
        //         const token = localStorage.getItem("token");
        //         if (!token) {
        //             console.error("No token found");
        //             return;
        //         }

        //         const response = await axios.get(
        //             "https://web-back-end-1.onrender.com/api/v1/auth/admin/all-users",
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //             }
        //         );

        //         if (response.data.success) {
        //             setTotalUsers(response.data.data.length);
        //         } else {
        //             console.error("Failed to fetch user data");
        //         }
        //     } catch (error) {
        //         console.error("Error fetching user data:", error);
        //     }
        // };

        // const fetchTotalProductsSold = async () => {
        //     try {
        //         const token = localStorage.getItem("token");
        //         if (!token) {
        //             console.error("No token found");
        //             return;
        //         }

        //         const response = await axios.get(
        //             "https://web-back-end-1.onrender.com/api/v1/cart/admin/total-paid-items",
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //             }
        //         );

        //         if (response.data.success) {
        //             const products = response.data.data;

        //             const totalSold = products.reduce((acc, product) => {
        //                 return acc + parseInt(product.totalQuantitySold, 10);
        //             }, 0);
        //             setTotalProductsSold(totalSold);

        //             const totalIncome = products.reduce((acc, product) => {
        //                 const quantity = parseInt(
        //                     product.totalQuantitySold,
        //                     10
        //                 );
        //                 const price = parseFloat(product.price);
        //                 const discount = product.discount / 100;
        //                 const discountedPrice = price * (1 - discount);
        //                 return acc + quantity * discountedPrice;
        //             }, 0);
        //             setTotalIncome(totalIncome);

        //             // Calculate most sold quantity product
        //             const mostSoldProduct = products.reduce(
        //                 (max, product) => {
        //                     const quantity = parseInt(
        //                         product.totalQuantitySold,
        //                         10
        //                     );
        //                     return quantity > max.quantity
        //                         ? { name: product.product_name, quantity }
        //                         : max;
        //                 },
        //                 { name: "", quantity: 0 }
        //             );
        //             setMostSoldProduct(mostSoldProduct);

        //             // Calculate highest income product
        //             const highestIncomeProduct = products.reduce(
        //                 (max, product) => {
        //                     const quantity = parseInt(
        //                         product.totalQuantitySold,
        //                         10
        //                     );
        //                     const price = parseFloat(product.price);
        //                     const discount = product.discount / 100;
        //                     const income = quantity * price * (1 - discount);
        //                     return income > max.income
        //                         ? { name: product.product_name, income }
        //                         : max;
        //                 },
        //                 { name: "", income: 0 }
        //             );
        //             setHighestIncomeProduct(highestIncomeProduct);
        //         } else {
        //             console.error("Failed to fetch total sold items");
        //         }
        //     } catch (error) {
        //         console.error("Error fetching total sold items:", error);
        //     }
        // };

        fetchData();
        // fetchUserCount();
        // fetchTotalProductsSold();
    }, []);

    useEffect(() => {
        if (chartData.labels) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const newChartInstance = new Chart(chartRef.current, {
                type: "doughnut",
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });

            setChartInstance(newChartInstance);
        }
    }, [chartData]);

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.title}>Thống kê sản phẩm</h2>
            <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.chartBox}>
                        <canvas ref={chartRef} />
                    </div>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.statsBox}>
                        <div>
                            <h1 className={styles.label}>
                                Tổng số người dùng:
                            </h1>
                            <h1 className={styles.valueRed}>{totalUsers}</h1>
                        </div>
                        <div>
                            <h1 className={styles.label}>
                                Tổng số sản phẩm đã bán:
                            </h1>
                            <h1 className={styles.valueBlue}>
                                {totalProductsSold}
                            </h1>
                        </div>
                        <div>
                            <h1 className={styles.label}>Tổng số doanh thu:</h1>
                            <h1 className={styles.valueGreen}>{totalIncome}</h1>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className={styles.summaryBox}>
                <Col span={24} className={styles.summaryItem}>
                    <h1 className={styles.highlight}>Sản phẩm bán chạy nhất</h1>
                    <h1 className={styles.productName}>
                        {mostSoldProduct.name}
                    </h1>
                    <h1 className={styles.valueRed}>
                        {mostSoldProduct.quantity}
                    </h1>
                </Col>
                <Col span={24} className={styles.summaryItem}>
                    <h1 className={styles.highlight}>
                        Sản phẩm có doanh thu cao nhất
                    </h1>
                    <h1 className={styles.productName}>
                        {highestIncomeProduct.name}
                    </h1>
                    <h1 className={styles.valueGreen}>
                        {highestIncomeProduct.income}
                    </h1>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;