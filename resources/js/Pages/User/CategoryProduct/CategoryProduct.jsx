import axios from "axios";
import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./CategoryProduct.module.scss";
import classNames from "classnames/bind";
import Card from "~/components/Card";
import config from "~/config";

const cx = classNames.bind(styles);

const CategoryProduct = () => {
    const [category, setCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOption, setSortOption] = useState(""); // Sắp xếp
    const { categoryId } = useParams();

    useEffect(() => {
        if (!categoryId) {
            console.error("category_id is undefined");
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/category/${categoryId}`);
                const productList = response.data.products || [];

                setCategory(response.data.category || "");
                setProducts(productList);
                setFilteredProducts(productList);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setCategory("");
                setProducts([]);
                setFilteredProducts([]);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const handleFilter = () => {
        let temp = [...products];

        // Hàm lấy giá cuối cùng
        const getFinalPrice = (p) => {
            return p.discount_price && p.discount_price > 0
                ? p.discount_price
                : p.price;
        };

        // Hàm kiểm tra có giảm giá thật không
        const isDiscounted = (p) => p.discount_price && p.discount_price > 0;

        // Lọc theo khoảng giá
        if (minPrice !== "") {
            temp = temp.filter((p) => getFinalPrice(p) >= parseFloat(minPrice));
        }

        if (maxPrice !== "") {
            temp = temp.filter((p) => getFinalPrice(p) <= parseFloat(maxPrice));
        }

        // Sắp xếp theo lựa chọn
        switch (sortOption) {
            case "priceAsc":
                temp.sort((a, b) => {
                    const aPrice = getFinalPrice(a);
                    const bPrice = getFinalPrice(b);
                    return aPrice - bPrice;
                });
                break;
            case "priceDesc":
                temp.sort((a, b) => {
                    const aPrice = getFinalPrice(a);
                    const bPrice = getFinalPrice(b);
                    return bPrice - aPrice;
                });
                break;
            case "name":
                temp.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "rating":
                temp.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        setFilteredProducts(temp);
    };

    const resetFilter = () => {
        setMinPrice("");
        setMaxPrice("");
        setSortOption("");
        setFilteredProducts(products);
    };

    return (
        <div className={cx("list-product")}>
            <h2 className={cx("sectionHeading")}>SẢN PHẨM "{category}"</h2>

            {/* Bộ lọc */}
            <div className={cx("filter-container")}>
                <div className={cx("sort-filter")}>
                    <label>Sắp xếp theo:</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">-- Không chọn --</option>
                        <option value="priceAsc">Giá tăng dần</option>
                        <option value="priceDesc">Giá giảm dần</option>
                        <option value="name">Tên (A-Z)</option>
                        <option value="rating">Đánh giá cao</option>
                    </select>
                </div>

                <div className={cx("button-group")}>
                    <button onClick={handleFilter}>Lọc</button>
                    <button onClick={resetFilter}>Đặt lại</button>
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
            {filteredProducts.length === 0 ? (
                <p className={cx("noHeading")}>Không có sản phẩm nào</p>
            ) : (
                <section className={cx("newStyleSection")}>
                    <div className={cx("productList")}>
                        {filteredProducts.map((product, index) => (
                            <Card key={index} product={product} />
                        ))}
                    </div>
                </section>
            )}

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

export default CategoryProduct;
