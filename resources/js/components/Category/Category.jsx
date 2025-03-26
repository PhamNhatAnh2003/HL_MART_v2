import React, { useState, useEffect } from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import styles from "./Category.module.scss"; // Import SCSS module
import classNames from "classnames/bind";

const cx = classNames.bind(styles);


const categories = [
    // "Giá Siêu Rẻ",
    // "Ưu Đãi Hội Viên",
    // "Sữa các loại",
    // "Rau - Củ - Trái Cây",
    // "Hóa Phẩm - Tẩy rửa",
    // "Chăm Sóc Cá Nhân",
    // "Thịt - Hải Sản Tươi",
    // "Bánh Kẹo",
    // "Đồ uống có cồn",
    // "Đồ Uống - Giải Khát",
    // "Mì - Thực Phẩm Ăn Liền",
    // "Thực Phẩm Khô",
    // "Thực Phẩm Chế Biến",
    // "Gia vị",
    // "Thực Phẩm Đông Lạnh",
    // "Trứng - Đậu Hũ",
    // "Chăm Sóc Bé",
    // "Đồ Dùng Gia Đình",
    // "Điện Gia Dụng",
    // "Văn Phòng Phẩm - Đồ Chơi",
];

const Category = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]); // Khởi tạo mảng rỗng
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Lỗi HTTP: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setCategories(data);

                console.log("Dữ liệu từ API:", data); // Kiểm tra API
   
            })
            .catch((err) => {
                setError(err.message);

            });
    }, []);

    return (
        <div className={styles["category-menu"]}>
            <button
                className={styles["menu-toggle"]}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaBars /> Danh mục sản phẩm
            </button>
            <div
                className={`${styles["menu-dropdown"]} ${
                    isOpen ? styles["open"] : ""
                }`}
            >
                {categories.map((category) => (
                    <div className={cx("menu-item")} key={category.id}>
                        {category.name}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Category;
