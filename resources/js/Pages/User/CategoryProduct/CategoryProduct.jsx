import axios from "axios"; // Giả sử bạn lấy dữ liệu từ API
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useActionState, useContext } from "react";
import styles from "./CategoryProduct.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CategoryProduct = () => {
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
                setProducts(response.data.products.data || []); // Lấy danh sách sản phẩm từ data
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setProducts([]); // Tránh lỗi nếu API gặp sự cố
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <div>
            <h2>Danh sách sản phẩm</h2>
            {products.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - {product.price}đ
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryProduct;
