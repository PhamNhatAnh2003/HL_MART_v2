import axios from "axios"; // Giả sử bạn lấy dữ liệu từ API
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useActionState, useContext } from "react";
import styles from "./CategoryProduct.module.scss";
import classNames from "classnames/bind";
import Card from "~/components/Card";
import { Link, useNavigate } from "react-router-dom";
import config from "~/config";

const cx = classNames.bind(styles);

const CategoryProduct = () => {
    const [category, setCategory] = useState(""); // Lưu tên danh mục
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams(); // Lấy category_id từ URL

    useEffect(() => {
        if (!categoryId) {
            console.error("category_id is undefined");
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/category/${categoryId}`);
                console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu
                setCategory(response.data.category || ""); // Lưu tên danh mục
                setProducts(response.data.products || []); // Lưu danh sách sản phẩm
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                 setCategory(""); // Tránh lỗi nếu API gặp sự cố
                 setProducts([]);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <div className={cx("list-product")}>
            <h2 className={cx("sectionHeading")}>SẢN PHẨM "{category}"</h2>

            {products.length === 0 ? (
                <p className={cx("noHeading")}>Không có sản phẩm nào </p>
            ) : (
                <section className={cx("newStyleSection")}>
                    <div className={cx("productList")}>
                        {products.map((product, index) => (
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
