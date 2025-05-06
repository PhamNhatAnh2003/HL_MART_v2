import React, { useState, useEffect, useActionState, useContext } from "react";
import Card from "~/components/Card";
import axios from "axios";
import { Pagination } from "antd";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import Filter from "../../../components/Filter";
import { useSearchParams } from "react-router-dom";

const cx = classNames.bind(styles);

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("name") || ""; // Lấy giá trị tìm kiếm từ URL
    const [noProducts, setNoProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 12; // Số sản phẩm trên mỗi trang
    const [filters, setFilters] = useState({
        category_id: "",
        rating: "",
        start: "",
        end: "",
        name: "",
        sort_price: "",
        sort_rating: "",
        sort_time: "",
        per_page: 10,
    });

    useEffect(() => {
        console.log("Filters applied:", filters); // Kiểm tra filters có thay đổi không
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/products`, {
                    params: {
                        ...filters,
                        name: searchQuery,
                        page: currentPage,
                        per_page: perPage,
                    },
                });

                if (response.status === 200) {
                    setProducts(response.data.products.data);
                    setNoProducts(response.data.products.data.length === 0);
                    setTotalPages(response.data.products.meta.last_page);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setNoProducts(true);
            }
        };

        fetchProducts();
    }, [currentPage, filters, searchQuery]);


    return (
        <div className={cx("container")}>
            <Filter onFilterChange={setFilters} />
            <h1 className={cx("title")}>Tất Cả Sản Phẩm</h1>
            <div className={cx("grid")}>
                {noProducts ? (
                    <p className={cx("noProducts")}>
                        Không tìm thấy sản phẩm nào.
                    </p>
                ) : (
                    products.map((product, index) => (
                        <Card key={index} product={product} />
                    ))
                )}
            </div> 
            <div className={cx("pagination")}>
                <Pagination
                    
                    align="center"
                    current={currentPage}
                    total={totalPages * perPage} // Tổng số sản phẩm
                    pageSize={perPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};


export default ProductList;
