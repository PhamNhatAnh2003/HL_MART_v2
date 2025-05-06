import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Col, Row } from "antd";
import { formatPrice } from "~/utils/format";
import styles from "./Dashboard.module.scss"
import classNames from "classnames/bind";

const cx = classNames.bind(styles);


const Dashboard = () => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [chartData, setChartData] = useState({});
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mostSoldProduct, setMostSoldProduct] = useState({});
    const [highestIncomeProduct, setHighestIncomeProduct] = useState({});


   useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/productlist");
    //   console.log('Phản hồi API:', response.data); // Kiểm tra lại cấu trúc của phản hồi

      const products = response.data.products; // Đảm bảo bạn truy cập đúng nơi chứa mảng sản phẩm
      if (!products || products.length === 0) {
        console.error('Không có dữ liệu sản phẩm');
        return; // Dừng thực thi nếu không có dữ liệu sản phẩm
      }

      const categoryCounts = products.reduce((acc, product) => {
        const category = product.category_name || 'Không xác định'; // Thêm kiểm tra nếu không có category_name
        if (!acc[category]) acc[category] = 0;
        acc[category]++;
        return acc;
      }, {});

      const mostSoldCategory = Object.entries(categoryCounts).reduce(
        (max, [category, count]) =>
          count > max.count ? { category, count } : max,
        { category: "Không xác định", count: 0 } // Mặc định là "Không xác định" nếu không có category
      );

    //   console.log('Most Sold Category:', mostSoldCategory); // Kiểm tra giá trị category

      const data = {
          labels: Object.keys(categoryCounts),
          datasets: [
              {
                  data: Object.values(categoryCounts),
                  backgroundColor: [
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
                  ],
                  label: "Số lượng sản phẩm", // Nhãn cho biểu đồ
              },
          ],
      };

      setChartData(data); // Lưu dữ liệu biểu đồ vào state
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
  };


       const fetchUserCount = async () => {
           try {
               const response = await axios.get(
                   "http://127.0.0.1:8000/api/dashboard/stats"
               );
            //    console.log("Phản hồi API:", response.data); // Kiểm tra lại cấu trúc của phản hồi

               if (response.data && response.data.data) {
                   setTotalUsers(response.data.data.total_users); // Lấy total_users từ response
                   setTotalProductsSold(response.data.data.total_sold_products); // Lấy total_sold_products từ response
                   setTotalPrice(response.data.data.total_revenue); // Lấy total_revenue từ response
               } else {
                   console.error(
                       "Dữ liệu không hợp lệ hoặc không có thông tin thống kê"
                   );
               }
           } catch (error) {
               console.error("Lỗi khi lấy dữ liệu thống kê:", error);
           }
       };


        fetchData();
        fetchUserCount();
    }, []);

    const fetchMostSoldProduct = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/product/most-sold"
            );
            console.log(response.data);
            // Hiển thị thông tin sản phẩm bán chạy nhất
         if (response.data && response.data.data) {
             const mostSoldProduct = response.data.data;
             setMostSoldProduct({
                 name: mostSoldProduct.product_name,
                 quantity: mostSoldProduct.quantity,
                 price: mostSoldProduct.price
             });
         } else {
             console.error(
                 "Dữ liệu không hợp lệ hoặc không có thông tin sản phẩm bán chạy nhất"
             );
         }
        } catch (error) {
            console.error("Error fetching most sold product:", error);
        }
    };

    const fetchHighestIncomeProduct = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/product/highest-income"
            );
            // console.log(response.data);

            if (response.data && response.data.data) {
                const highestIncomeProduct = response.data.data;
                setHighestIncomeProduct({
                    name: highestIncomeProduct.product_name,
                    total_price: highestIncomeProduct.total_price,
                    price: highestIncomeProduct.price,
                });
            } else {
                console.error(
                    "Dữ liệu không hợp lệ hoặc không có thông tin sản phẩm có doanh thu cao nhất"
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm có doanh thu cao nhất:", error);
        }
    };

    // Call API trong useEffect hoặc sự kiện
    useEffect(() => {
        fetchMostSoldProduct();
        fetchHighestIncomeProduct();
    }, []);



    useEffect(() => {
        if (chartData.labels) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const newChartInstance = new Chart(chartRef.current, {
                type: "pie",
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
        <div className={cx("dashboardContainer")}>
            <h2 className={cx("title")}>Thống kê sản phẩm</h2>
            
            <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div className={cx("chartBox")}>
                        <canvas ref={chartRef} />
                    </div>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
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
            {/* <Row className={cx("summaryBox")}>
                <Col span={24} className={cx("summaryItem")}>
                    <h1 className={cx("highlight")}>Sản phẩm bán chạy nhất</h1>
                    <h1 className={cx("productName")}>
                        {mostSoldProduct.name}
                    </h1>
                    <div className={cx("valueRed")}>
                        Đã bán: {mostSoldProduct.quantity}
                    </div>
                    <h1 className={cx("valueGreen")}>
                        Giá bán: {formatPrice(mostSoldProduct.price)}
                    </h1>
                </Col>
                <Col span={24} className={cx("summaryItem")}>
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
                </Col>
            </Row> */}
            <div className={cx("summaryGrid")}>
                <div className={cx("summaryItem")}>
                    <h1 className={cx("highlight")}>Sản phẩm đặt hàng nhiều nhất</h1>
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