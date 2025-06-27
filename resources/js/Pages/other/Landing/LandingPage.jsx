import React, { useContext, useEffect, useState } from "react";
import images from "~/assets/images";
import styles from "./LandingPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import config from "~/config";
import axios from "axios";
import classNames from "classnames/bind";
import { AuthContext } from "~/context/AuthContext";
import showToast from "~/components/message";
import { formatPrice } from "~/utils/format";

const cx = classNames.bind(styles);


export default function LandingPage() {
    const { user } = useContext(AuthContext);
    const [products, setTopProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        console.log("Clicked!", user);
        if (!user || Object.keys(user).length === 0) {
            showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }
    }

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
                console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu

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
        <div className={cx("landing")}>
            {/* Header */}
            <header className={cx("header")}>
                <div className={cx("logo")}>HL MART</div>
                <div className={cx("authButtons")}>
                    <Link to="/login" className={cx("loginBtn")}>
                        Đăng nhập
                    </Link>
                    <Link to="/register" className={cx("registerBtn")}>
                        Đăng ký
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className={cx("hero")}>
                <div className={cx("heroText")}>
                    <h1>Ưu đãi lớn cho mùa hè!</h1>
                    <p>Giảm giá lên đến 50% cho nhiều mặt hàng</p>
                    <button
                        onClick={() => navigate(config.routes.other.login)}
                        className={cx("shopNowBtn")}
                    >
                        Mua ngay
                    </button>
                </div>
                <img src={images.landing} alt="Khuyến mãi" />
            </section>

            {/* New Products */}
            <section className={cx("categories")}>
                <h2>Các sản phẩm mới </h2>
                <div className={cx("grid")}>
                    {newProducts.map((p) => (
                        <div className={cx("productCard")} key={p.id}>
                            <img src={p.avatar} alt={p.name} />
                            <h3>{p.name}</h3>
                            <p>{formatPrice(p.price)} </p>
                            <button onClick={() => handleAddToCart(p)}>
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Selling Products */}
            <section className={cx("products")}>
                <h2>Sản phẩm bán chạy</h2>
                <div className={cx("grid")}>
                    {products.map((p) => (
                        <div className={cx("productCard")} key={p.id}>
                            <img src={p.avatar} alt={p.name} />
                            <h3>{p.name}</h3>
                            <p>{formatPrice(p.price)}</p>
                            <button onClick={() => handleAddToCart(p)}>
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className={cx("cta")}>
                <h2>Đăng ký thành viên để nhận ưu đãi riêng!</h2>
                <button
                    onClick={() => navigate(config.routes.other.register)}
                    className={cx("ctaBtn")}
                >
                    Đăng ký ngay
                </button>
            </section>
            <footer className={cx("footer")}>
                <p>
                    © 2025 HL Mart. Hotline: 0912198345 | Email:
                    anh.pn214987@sis.hust.edu.vn
                </p>
                <p>Địa chỉ: Thôn Kim Cương 1, xã Sơn Kim 1, Hà Tĩnh</p>
            </footer>
        </div>
    );
}
