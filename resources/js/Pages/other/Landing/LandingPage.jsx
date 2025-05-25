import React, { useContext, useEffect, useState } from "react";
import images from "~/assets/images";
import styles from "./LandingPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import config from "~/config";
import axios from "axios";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const categories = [
    { name: "Đồ gia dụng", image: "/assets/category1.jpg" },
    { name: "Thực phẩm", image: "/assets/category2.jpg" },
    { name: "Đồ nhà bếp", image: "/assets/category3.jpg" },
    { name: "Đồ uống", image: "/assets/category4.jpg" },
];



export default function LandingPage() {
    const [products, setTopProducts] = useState([]);

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
        <div className={styles.landing}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>HL Mart</div>
                <div className={styles.authButtons}>
                    <Link to="/login" className={styles.loginBtn}>
                        Đăng nhập
                    </Link>
                    <Link to="/register" className={styles.registerBtn}>
                        Đăng ký
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>Ưu đãi lớn cho mùa hè!</h1>
                    <p>Giảm giá lên đến 50% cho nhiều mặt hàng</p>
                    <button className={styles.shopNowBtn}>Mua ngay</button>
                </div>
                <img src={images.landing} alt="Khuyến mãi" />
            </section>

            {/* Categories */}
            <section className={styles.categories}>
                <h2>Danh mục nổi bật</h2>
                <div className={styles.grid}>
                    {categories.map((cat, index) => (
                        <div className={styles.categoryCard} key={index}>
                            <img src={cat.image} alt={cat.name} />
                            <p>{cat.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Selling Products */}
            <section className={styles.products}>
                <h2>Sản phẩm bán chạy</h2>
                <div className={styles.grid}>
                    {products.map((p) => (
                        <div className={styles.productCard} key={p.id}>
                            <img src={p.avatar} alt={p.name} />
                            <h3>{p.name}</h3>
                            <p>{p.price.toLocaleString()} đ</p>
                            <button>Thêm vào giỏ</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className={styles.cta}>
                <h2>Đăng ký thành viên để nhận ưu đãi riêng!</h2>
                <button className={styles.ctaBtn}>Đăng ký ngay</button>
            </section>
        </div>
    );
}
