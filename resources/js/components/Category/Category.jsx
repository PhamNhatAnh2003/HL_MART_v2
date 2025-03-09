import React, { useState } from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import styles from "./Category.module.scss"; // Import SCSS module

const categories = [
    "Giá Siêu Rẻ",
    "Ưu Đãi Hội Viên",
    "Sữa các loại",
    "Rau - Củ - Trái Cây",
    "Hóa Phẩm - Tẩy rửa",
    "Chăm Sóc Cá Nhân",
    "Thịt - Hải Sản Tươi",
    "Bánh Kẹo",
    "Đồ uống có cồn",
    "Đồ Uống - Giải Khát",
    "Mì - Thực Phẩm Ăn Liền",
    "Thực Phẩm Khô",
    "Thực Phẩm Chế Biến",
    "Gia vị",
    "Thực Phẩm Đông Lạnh",
    "Trứng - Đậu Hũ",
    "Chăm Sóc Bé",
    "Đồ Dùng Gia Đình",
    "Điện Gia Dụng",
    "Văn Phòng Phẩm - Đồ Chơi",
];

const Category = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                {categories.map((category, index) => (
                    <div key={index} className={styles["menu-item"]}>
                        {category}
                        <FaChevronRight className={styles["arrow-icon"]} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
