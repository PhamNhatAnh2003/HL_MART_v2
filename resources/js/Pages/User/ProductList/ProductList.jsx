import React, { useState, useEffect, useActionState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRedo,
    faThLarge,
    faBars,
    faAngleRight,
    faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import images from "~/assets/images";
import Dropdown from "~/components/Dropdown";
import { CheckboxInput } from "~/components/Checkbox";
import Rating from "~/components/Rating";
import Button from "~/components/Button";

import Search from "~/components/Search";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import RadioInput from "~/components/radio";
import { AuthContext } from "~/context/AuthContext";
import { useLocation } from "react-router-dom";
const cx = classNames.bind(styles);

const ProductList = () => {
    const [isGridView, setIsGridView] = useState(true);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [user, setUser] = useState({});
    const [ratings, setRatings] = useState([]);
    const [types, setTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [distances, setDistances] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPriceProducts, setTotalPriceroducts] = useState([]);
    const [totalStyleProducts, setTotalStyleProducts] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [favoriteProductsIds, setFavoriteProductsIds] = useState([]);

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const name = urlParams.get("name");

    console.log(products);

    //state filter

    const [filterDrPrice, setFilterDrPrice] = useState(
        "評価: 低から高",
        "高から低"
    );
    const [filterDrRating, setFilterDrRating] = useState("1 - 5", "5 - 1");
    const [priceRange, setPriceRange] = useState({ start: null, end: null });
    const [priceType, setPriceType] = useState();
    const { userId } = useContext(AuthContext);
    console.log(localStorage.getItem("userId"));

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const response = await axios.get(`/api/restaurants`, {
    //                 params: {
    //                     style_ids: styles.toString(),
    //                     sort_price:
    //                         filterDrPrice === ""
    //                             ? ""
    //                             : filterDrPrice === "評価: 低から高"
    //                             ? "asc"
    //                             : "desc",
    //                     sort_rating:
    //                         filterDrRating === ""
    //                             ? ""
    //                             : filterDrRating === "1 - 5"
    //                             ? "asc"
    //                             : "desc",
    //                     page: currentPage,
    //                     per_page: 9,
    //                     ratings: ratings.toString(),
    //                     start: priceRange.start || "",
    //                     end: priceRange.end || "",
    //                     distance_types: distances.toString(),
    //                     user_id: userId,
    //                     name: name,
    //                 },
    //             });
    //             // console.log(response.data.restaurants);

    //             if (response.status === 200) {
    //                 setProducts(response.data.restaurants.data);
    //                 setTotalPages(response.data.restaurants.meta.last_page);
    //                 setTotalProducts(response.data.restaurants.meta.total);
    //                 // console.log(response.data.restaurants.data);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching products:", error);
    //         }
    //     };

    //     fetchProducts();
    // }, [
    //     types,
    //     ratings,
    //     styles,
    //     currentPage,
    //     filterDrPrice,
    //     filterDrRating,
    //     priceType,
    //     distances,
    //     name,
    // ]);

    // useEffect(() => {
    //     const fetchTotalProducts = async () => {
    //         const userId = localStorage.getItem("userId");
    //         try {
    //             const response = await axios.get("/api/restaurants/count", {
    //                 params: {
    //                     user_id: userId,
    //                 },
    //             });
    //             if (response.status === 200) {
    //                 // console.log(response);
    //                 setTotalStyleProducts(response.data.styles);
    //                 setTotalPriceroducts(response.data.prices);

    //                 // setTotalRatingProducts(response.data.ratings);
    //             }
    //         } catch (error) {
    //             alert(
    //                 "Error fetching total products" +
    //                     error.response.data.message
    //             );
    //             console.error("Error fetching total products:", error);
    //         }
    //     };
    //     fetchTotalProducts();
    // }, []);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const userId = localStorage.getItem("userId");
    //         // console.log(userId);
    //         try {
    //             const response = await axios.get("/api/user", {
    //                 params: {
    //                     id: userId,
    //                 },
    //             });
    //             if (response.status === 200) {
    //                 console.log(response);
    //                 setUser(response.data.user);

    //                 // setTotalRatingProducts(response.data.ratings);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching total User:", error);
    //         }
    //     };
    //     fetchUser();
    // }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 405,
            behavior: "smooth",
        });
    };

    const handlePriceTypeChange = (typeId) => {
        if (typeId === priceType) {
            setPriceRange({ start: null, end: null });
            setPriceType(0);
        } else {
            switch (typeId) {
                case 1:
                    setPriceRange({ start: null, end: user.price_start });
                    break;
                case 2:
                    setPriceRange({
                        start: user.price_start,
                        end: user.price_end,
                    });
                    break;
                case 3:
                    setPriceRange({ start: user.price_end, end: null });
                    break;
                case 4:
                    setPriceRange({ start: null, end: null });
            }
            setPriceType(typeId);
        }
        setCurrentPage(1);
    };

    const handleStyleChange = (styleId) => {
        setStyles((prevStyles) => {
            const newStyles = [...prevStyles];
            if (newStyles.includes(styleId)) {
                newStyles.splice(newStyles.indexOf(styleId), 1);
            } else {
                newStyles.push(styleId);
            }
            setCurrentPage(1);
            return newStyles;
        });
    };

    const handleRatingChange = (productRating) => {
        setRatings((prevRatings) => {
            const newRatings = [...prevRatings];
            if (newRatings.includes(productRating)) {
                newRatings.splice(newRatings.indexOf(productRating), 1);
            } else {
                newRatings.push(productRating);
            }
            setCurrentPage(1);
            return newRatings;
        });
    };

    const handleDistanceChange = (distanceId) => {
        setDistances((prevDistances) => {
            const newDistances = [...prevDistances];
            if (newDistances.includes(distanceId)) {
                newDistances.splice(newDistances.indexOf(distanceId), 1);
            } else {
                newDistances.push(distanceId);
            }
            setCurrentPage(1);
            return newDistances;
        });
    };

    const searchProducts = async (searchS) => {
        try {
            const response = await axios.get("/api/restaurants", {
                params: { name: searchS },
            });
            if (response.status === 200) {
                setProducts(response.data.restaurants.data);
                setTotalPages(response.data.restaurants.meta.last_page);
            }
        } catch (error) {
            alert("Error fetching products" + error.response.data.message);
            console.error("Error fetching products:", error);
        }
    };

    const handleClearFilter = () => {
        setStyles([]);
        setRatings([]);
        setCurrentPage(1);
        setPriceRange({});
        setPriceType(0);
    };

    const handleSortPrice = () => {
        setFilterDrRating("");
    };

    const handleSortRating = () => {
        setFilterDrPrice("");
    };
    console.log(products);

    return (
        <div className={cx("find-restaurant")}>
            <div className={cx("banner")}>
                <img
                    src={images.headerFindRestaurant}
                    alt="Restaurant Banner"
                />
                <h1>カフェを探すのはやめて、見つけましょう。</h1>
                <div className={cx("search-bar-wrapper")}>
                    <Search
                        type="text"
                        width="100%"
                        placeholder="名前、料理、場所からレストランを検索"
                        value={search}
                        setValue={setSearch}
                        onKeyDown={(e) => searchProducts(e.target.value)}
                    />
                </div>
            </div>
            <div className={cx("filters-container")}>
                <div className={cx("filters-left")}>
                    <h4>フィルター</h4>
                    <a onClick={() => handleClearFilter()} href="#">
                        <FontAwesomeIcon icon={faRedo} />
                        フィルターをクリア
                    </a>
                    <h3>{`5秒で${totalProducts}件の結果が見つかりました`}</h3>
                </div>
                <div className={cx("filters-right")}>
                    <h3>並べ替え:</h3>
                    <Dropdown
                        title="並べ替え"
                        width="151px"
                        setValue={setFilterDrPrice}
                        selected={filterDrPrice}
                        handleClick={handleSortPrice}
                    >
                        <div>評価: 低から高</div>
                        <div>評価: 高から低</div>
                    </Dropdown>
                    <h3>結果:</h3>
                    <Dropdown
                        title="結果"
                        width="100px"
                        setValue={setFilterDrRating}
                        selected={filterDrRating}
                        handleClick={handleSortRating}
                    >
                        <div>1 - 5</div>
                        <div>5 - 1</div>
                    </Dropdown>
                    <FontAwesomeIcon
                        icon={faThLarge}
                        className={cx("view-icon", { active: isGridView })}
                        onClick={() => setIsGridView(true)}
                    />
                    <FontAwesomeIcon
                        icon={faBars}
                        className={cx("view-icon", { active: !isGridView })}
                        onClick={() => setIsGridView(false)}
                    />
                </div>
            </div>

            <div className={cx("content")}>
                <div className={cx("filter")}>
                    <div className={cx("filter-option")}>
                        <h3>価格（円）</h3>
                        <RadioInput
                            id="1"
                            checked={priceType === 1}
                            onChange={() => handlePriceTypeChange(1)}
                        >
                            安い({totalPriceProducts[1]})
                        </RadioInput>
                        <RadioInput
                            id="2"
                            checked={priceType === 2}
                            onChange={() => handlePriceTypeChange(2)}
                        >
                            手頃な価格({totalPriceProducts[2]})
                        </RadioInput>
                        <RadioInput
                            id="3"
                            checked={priceType === 3}
                            onChange={() => handlePriceTypeChange(3)}
                        >
                            高い({totalPriceProducts[3]})
                        </RadioInput>
                        <RadioInput
                            id="4"
                            checked={priceType === 4}
                            onChange={() => handlePriceTypeChange(4)}
                        >
                            高価なものはすべて({totalPriceProducts[4]})
                        </RadioInput>
                    </div>
                    <div className={cx("filter-option")}>
                        <h3>カフェの空間スタイル</h3>
                        <CheckboxInput
                            id="5"
                            checked={styles.includes(1)}
                            onChange={() => handleStyleChange(1)}
                        >
                            {`開放的な空間 (${totalStyleProducts[1]})`}
                        </CheckboxInput>
                        <CheckboxInput
                            id="6"
                            checked={styles.includes(2)}
                            onChange={() => handleStyleChange(2)}
                        >
                            {`現代的な空間 (${totalStyleProducts[2]}) `}
                        </CheckboxInput>
                        <CheckboxInput
                            id="7"
                            checked={styles.includes(3)}
                            onChange={() => handleStyleChange(3)}
                        >
                            {`レトロな空間 (${totalStyleProducts[3]})`}
                        </CheckboxInput>
                        <CheckboxInput
                            id="8"
                            checked={styles.includes(4)}
                            onChange={() => handleStyleChange(4)}
                        >
                            {` 落ち着いた空間 (${totalStyleProducts[4]})`}
                        </CheckboxInput>
                        <CheckboxInput
                            id="9"
                            checked={styles.includes(5)}
                            onChange={() => handleStyleChange(5)}
                        >
                            {` 高級な空間 (${totalStyleProducts[5]})`}
                        </CheckboxInput>
                        <CheckboxInput
                            id="10"
                            checked={styles.includes(6)}
                            onChange={() => handleStyleChange(6)}
                        >
                            {`共有スペース (${totalStyleProducts[6]})`}
                        </CheckboxInput>
                    </div>
                    <div className={cx("filter-option")}>
                        <h3>評価</h3>
                        <CheckboxInput
                            id="11"
                            checked={ratings.includes(1)}
                            onChange={() => {
                                handleRatingChange(1);
                            }}
                        >
                            <Rating small rate={1}></Rating>
                        </CheckboxInput>
                        <CheckboxInput
                            id="12"
                            checked={ratings.includes(2)}
                            onChange={() => {
                                handleRatingChange(2);
                            }}
                        >
                            <Rating small rate={2}></Rating>
                        </CheckboxInput>
                        <CheckboxInput
                            id="13"
                            checked={ratings.includes(3)}
                            onChange={() => {
                                handleRatingChange(3);
                            }}
                        >
                            <Rating small rate={3}></Rating>
                        </CheckboxInput>
                        <CheckboxInput
                            id="14"
                            checked={ratings.includes(4)}
                            onChange={() => {
                                handleRatingChange(4);
                            }}
                        >
                            <Rating small rate={4}></Rating>
                        </CheckboxInput>
                        <CheckboxInput
                            id="15"
                            checked={ratings.includes(5)}
                            onChange={() => {
                                handleRatingChange(5);
                            }}
                        >
                            <Rating small rate={5}></Rating>
                        </CheckboxInput>
                    </div>
                    <div className={cx("filter-option")}>
                        <h3>距離</h3>
                        <CheckboxInput
                            id="16"
                            checked={distances.includes(1)}
                            onChange={() => handleDistanceChange(1)}
                        >
                            0.5km 以内
                        </CheckboxInput>
                        <CheckboxInput
                            id="17"
                            checked={distances.includes(2)}
                            onChange={() => handleDistanceChange(2)}
                        >
                            0.5～1km
                        </CheckboxInput>
                        <CheckboxInput
                            id="18"
                            checked={distances.includes(3)}
                            onChange={() => handleDistanceChange(3)}
                        >
                            1～1.5km
                        </CheckboxInput>
                        <CheckboxInput
                            id="19"
                            checked={distances.includes(4)}
                            onChange={() => handleDistanceChange(4)}
                        >
                            1.5～2km
                        </CheckboxInput>
                        <CheckboxInput
                            id="20"
                            checked={distances.includes(5)}
                            onChange={() => handleDistanceChange(5)}
                        >
                            2km 以上
                        </CheckboxInput>
                    </div>
                </div>

                {/* <div
                    className={cx("cafe-list", {
                        "grid-view": isGridView,
                        "list-view": !isGridView,
                    })}
                >
                    {products.length > 0 ? (
                        products.map((cafe, index) => (
                            <CafeItem
                                cafe={cafe}
                                key={index}
                                id={cafe.id}
                                image={cafe.avatar}
                                name={cafe.name}
                                location={cafe.address}
                                price_start={cafe.price_start}
                                price_end={cafe.price_end}
                                distance={cafe.distance}
                                open_time={cafe.open_time}
                                close_time={cafe.close_time}
                                rating={cafe.rating}
                                number_reviews={cafe.number}
                                isListView={!isGridView}
                                isFavorited={cafe.isFavorited}
                            />
                        ))
                    ) : (
                        <div className={cx("no-result")}>結果なし</div>
                    )}
                </div> */}
            </div>
            <div className={cx("pagination")}>
                {products.length > 0 && (
                    <>
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                primary={currentPage === page}
                                small
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductList;
