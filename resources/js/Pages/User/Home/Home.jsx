import React, { useContext, useEffect, useState } from "react";
import Card from "~/components/Card";
import images from "~/assets/images";
import background from "~/assets/background";
import Button from "~/components/Button";
import { Link, useNavigate } from "react-router-dom";
import config from "~/config";
import axios from "axios";
import { AuthContext } from "~/context/AuthContext";
import classNames from "classnames/bind";
import Slider from "~/components/Slider";
import styles from "./Home.module.scss";


// Kết nối styles với cx
const cx = classNames.bind(styles);

const Home = () => {
    const { userId } = useContext(AuthContext);
    const [newProducts, setNewProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [specialProducts, setSpecialProducts] = useState([]);
    const navigate = useNavigate();

    const medias = [images.slider1, images.slider2];

    useEffect(() => {
        const fetchSpecialProducts = async () => {
            try {
                const res = await axios.post("/api/products/recommendations", {
                    user_id: userId,
                });
                console.log("Dữ liệu gợi ý trả về:", res.data);
                if (res.data) {
                    setSpecialProducts(res.data);
                } else {
                    setSpecialProducts([]);
                }
            } catch (err) {
                setError("Lấy gợi ý sản phẩm lỗi");
            } 
        };

        if (userId) {
            fetchSpecialProducts();
        }
    }, [userId]);


    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const response = await axios.get("/api/products/latest");
                // console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu

                if (response.status === 200) {
                    setNewProducts(response.data.data || []); // Đổi từ response.data.products -> response.data.data
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm mới:", error);
                setNewProducts([]); // Tránh lỗi undefined
            }
        };
        fetchNewProducts();
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await axios.get("/api/top-products");
                // console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu

                if (response.status === 200) {
                    setTopProducts(response.data.data || []); // Đổi từ response.data.products -> response.data.data
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm mới:", error);
                setTopProducts([]); // Tránh lỗi undefined
            }
        };
        fetchTopProducts();
    }, []);

    return (
        <div className={cx("homePage")}>
            {/* QC Bar Section */}
            <section className={cx("hero-section")}>
                <div className={cx("hero-slider")}>
                    <Slider medias={medias} />
                </div>
                <div className={cx("hero-banners")}>
                    <img src={images.slider2} alt="Banner 1" />
                    <img src={images.slider3} alt="Banner 2" />
                </div>
            </section>

            {/* New Product Section */}
            <section className={cx("newStyleSection")}>
                <h2 className={cx("sectionHeading")}>CÓ THỂ BẠN QUAN TÂM</h2>
                <div className={cx("productList")}>
                    {specialProducts.map((product, index) => (
                        <Card key={product.id} product={product} />
                    ))}
                </div>
            </section>
            
            <section className={cx("newStyleSection")}>
                <h2 className={cx("sectionHeading")}>SẢN PHẨM MỚI NHẤT</h2>
                <div className={cx("productList")}>
                    {newProducts.map((product, index) => (
                        <Card key={index} product={product} />
                    ))}
                </div>
            </section>

            <section className={cx("newStyleSection")}>
                <h2 className={cx("sectionHeading")}>SẢN PHẨM BÁN CHẠY NHẤT</h2>
                <div className={cx("productList")}>
                    {topProducts.map((product, index) => (
                        <Card key={index} product={product} />
                    ))}
                </div>
            </section>

            <div className={cx("all-product-container")}>
                <Link
                    to={config.routes.user.productList}
                    className={cx("all-product")}
                >
                    Xem Tất cả Sản Phẩm
                </Link>
            </div>
        </div>
    );
};

export default Home;
