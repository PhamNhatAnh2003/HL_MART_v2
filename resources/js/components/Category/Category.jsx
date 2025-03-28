import React, { useState,useRef, useEffect } from "react";
import {
    FaBars,
    FaChevronRight,
    FaEnvelope,
    FaHeadphones,
} from "react-icons/fa";
import styles from "./Category.module.scss"; // Import SCSS module
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";


const cx = classNames.bind(styles);


const Category = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]); // Khởi tạo mảng rỗng
    const [error, setError] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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

useEffect(() => {
    function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
}, []);

     const handleCategoryClick = (categoryId) => {
         navigate(`/category/${categoryId}`);
     };


    return (
        <div className={cx("category-container")}>
            <div className={cx("category-menu")} ref={menuRef}>
                
                <button
                    className={cx("menu-toggle")}
                    // onClick={() => setIsOpen(!isOpen)}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <FaBars /> Danh mục sản phẩm
                </button>
                <div
                    className={`${cx("menu-dropdown")} ${
                        isOpen ? cx("open") : ""
                    }`}
                >
                    {categories.map((category) => (
                        <div
                            className={cx("menu-item")}
                            onClick={() => handleCategoryClick(category.id)}
                            key={category.id}
                        >
                            {category.name}{" "}
                            <FaChevronRight className="arrow-icon" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Phần Tin Tức và Chăm Sóc Khách Hàng */}
            <div className={cx("extra-menu")}>
                <div className={cx("menu-item")}>
                    <FaEnvelope className={cx("icon")} /> Tin Tức
                </div>
                <div className={cx("menu-item")}>
                    <FaHeadphones className={cx("icon")} /> Chăm sóc khách hàng
                </div>
            </div>
        </div>
    );
};

export default Category;
