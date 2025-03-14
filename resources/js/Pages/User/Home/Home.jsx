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

const Home = () => {
    const { user, userId } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [newRestaurant, setNewRestaurant] = useState([]);
    const [favoriteRestaurant, setFavoriteRestaurant] = useState([]);
    const navigate = useNavigate();

    console.log(newRestaurant);

    useEffect(() => {
        const fetchNew = async () => {
            try {
                const response = await axios.get(
                    `/api/restaurants?style_id=${
                        user.style_id ?? 1
                    }&sort_time=desc&per_page=5&page=1&user_id=${userId}`
                );
                if (response.status === 200) {
                    setNewRestaurant(response.data.restaurants.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchNew();
    }, []);

    useEffect(() => {
        const fetchFavorite = async () => {
            try {
                const response = await axios.get(
                    `/api/favorites_home?user_id=${userId}`
                );
                console.log(response);
                if (response.status === 200) {
                    setFavoriteRestaurant(response.data.restaurants.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchFavorite();
    }, [user]);

    const searchProducts = (event) => {
        if (event.key === "Enter") {
            navigate(`${config.routes.user.findRestaurant}?name=${search}`);
        }
    };

    return (
        <div className={styles.homePage}>
            {/* Search Bar Section */}
            <div className={styles.banner}>
                <img
                    src={images.headerFindRestaurant}
                    alt="Restaurant Banner"
                />
                <h1>カフェを探すのはやめて、見つけましょう。</h1>
                <div className={styles.searchBarWrapper}>
                    <input
                        type="text"
                        style={{ width: "100%" }}
                        placeholder="名前、料理、場所からレストランを検索"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={searchProducts}
                    />
                </div>
            </div>

            {/* New Cafe Style Section */}
            <section className={styles.newStyleSection}>
                <img
                    src={images.coffeeBlast}
                    alt="Coffee Blast"
                    className={styles.coffeeBlast}
                />
                <h2 className={styles.sectionHeading}>
                    カフェスタイルを楽しむ
                </h2>
                <p className={styles.sectionDescription}>
                    一緒にあらゆるスタイルのカフェを探検しましょう。体験する価値のある新しいカフェが常にあります。
                </p>
                <div className={styles.coffeeList}>
                    {newRestaurant.map((restaurant, index) => (
                        <Card key={index} restaurant={restaurant} />
                    ))}
                </div>
                <img
                    src={images.coffeeBlast}
                    alt="Coffee Blast"
                    className={styles.coffeeBlastDown}
                />
            </section>

            {/* Favorites Cafe Section */}
            <section className={styles.favoritesSection}>
                <h2 className={styles.sectionHeading}>お気に入るカフェ</h2>
                <p className={styles.sectionDescription}>
                    あなたのお気に入りのカフェが一挙に
                </p>
                <div className={styles.coffeeList}>
                    {favoriteRestaurant.map((restaurant, index) => (
                        <Card key={index} restaurant={restaurant} />
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
