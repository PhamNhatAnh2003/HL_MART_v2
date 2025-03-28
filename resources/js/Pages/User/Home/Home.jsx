import React, { useContext, useEffect, useState } from "react"; // Import useState
import Card from "~/components/Card";
import images from "~/assets/images";
import background from "~/assets/background";
import Button from "~/components/Button";
import styles from "./Home.module.scss";
import { Link, useNavigate } from "react-router-dom";
import config from "~/config";
import axios from "axios";
import { AuthContext } from "~/context/AuthContext";
import classNames from "classnames/bind";
import Slider from "../../../components/Slider/Slider";


const cx = classNames.bind(styles);

const Home = () => {
    const { user, userId } = useContext(AuthContext);
    const [newProducts, setNewProducts] = useState([]);
    const [favoriteRestaurant, setFavoriteRestaurant] = useState([]);
    const navigate = useNavigate();

    const medias = [images.slider1, images.slider2];

useEffect(() => {
    const fetchNewProducts = async () => {
        try {
            const response = await axios.get("/api/products/latest");
            console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu

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

    return (
        <div className={styles.homePage}>
            {/* QC Bar Section */}
            <div className={cx("first-section")}>
                <div className={cx("slider")}>
                    <Slider medias={medias} />
                </div>

                <div className={cx("banner")}>
                    <img src={images.slider1} alt="Restaurant Banner" />
                    <img src={images.slider2} alt="Restaurant Banner" />
                </div>
            </div>

            {/* New Product Section */}
            <section className={styles.newStyleSection}>
                <h2 className={styles.sectionHeading}>SẢN PHẨM MỚI NHẤT</h2>
                <div className={styles.productList}>
                    {newProducts.map((product, index) => (
                        <Card key={index} product={product} />
                    ))}
                </div>
            </section>

            <section className={styles.newStyleSection}>
                <h2 className={styles.sectionHeading}>SẢN PHẨM MỚI NHẤT</h2>
                <div className={styles.productList}>
                    {newProducts.map((product, index) => (
                        <Card key={index} product={product} />
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;
