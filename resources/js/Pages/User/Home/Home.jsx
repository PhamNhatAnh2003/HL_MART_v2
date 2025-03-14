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
            {/* Search Bar Section */}
            <div className={cx("first-section")}>
                <div className={cx("slider")}>
                    <Slider medias={medias} />
                </div>

                <div className={cx("banner")}>
                    <img src={images.slider1} alt="Restaurant Banner" />
                    <img src={images.slider2} alt="Restaurant Banner" />
                </div>
            </div>
            {/* New Cafe Style Section */}
            <section className={styles.newStyleSection}>
                <h2 className={styles.sectionHeading}>SẢN PHẨM BÁN CHẠY</h2>
                {/* <p className={styles.sectionDescription}>
                    一緒にあらゆるスタイルのカフェを探検しましょう。体験する価値のある新しいカフェが常にあります。
                </p> */}
                <div className={styles.productList}>
                    {newProducts.map((product, index) => (
                        <Card key={index} product={product} />
                    ))}
                </div>
            </section>



            {/* Footer */}
            <footer className={styles.footer}>
                <div style={{ height: "420px" }}>
                    <img
                        src={images.footerTop}
                        alt="Footer Top"
                        className={styles.footerTop}
                    />
                </div>
                <img
                    src={images.cfImage2}
                    alt="Footer Top"
                    className={styles.cfImage2}
                />
                <img
                    src={images.cfImage2}
                    alt="Footer Top"
                    className={styles.cfImage2Right}
                />
                <div
                    className={styles.footerContent}
                    style={{
                        background: `var(--bg-secondary) url(${images.footerDown})`,
                        backgroundSize: `contain`,
                    }}
                >
                    <nav className={styles.footerNav}>
                        <div className={styles.footerDesc}>
                            <h1 className={styles.footerLogoText}>SunRise</h1>
                            <p>
                                一日の始まりは、お気に入りのカフェで一杯のコーヒーから。
                            </p>
                            <p>
                                これまでにない豊かなフレーバーを楽しんで、特別なひとときを過ごしませんか？
                            </p>
                            <p>
                                Sun*の社員にぴったりのカフェを見つけて、最高の体験を提供します
                            </p>
                        </div>
                        <div className={styles.info}>
                            <ul>
                                <li>
                                    <strong>サービス</strong>
                                </li>
                                <li>探す</li>
                                <li>マップ</li>
                            </ul>
                            <ul>
                                <li>
                                    <strong>企業情報</strong>
                                </li>
                                <li>会社概要</li>
                                <li>企業方針</li>
                                <li>理念体系</li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default Home;
