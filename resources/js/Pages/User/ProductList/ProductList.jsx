import React, { useState, useEffect, useActionState, useContext } from "react";
import Card from "~/components/Card";
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
import { Pagination } from "antd";
import Search from "~/components/Search";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import RadioInput from "~/components/radio";
import { AuthContext } from "~/context/AuthContext";
import { useLocation } from "react-router-dom";


const cx = classNames.bind(styles);

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 12; // Số sản phẩm trên mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/products`, {
                    params: {
                        page: currentPage,
                        per_page: perPage,
                    },
                });

                if (response.status === 200) {
                    setProducts(response.data.products.data);
                    setTotalPages(response.data.products.meta.last_page);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        fetchProducts();
    }, [currentPage]);

     return (
         <div className={styles.container}>
             <h1 className={styles.title}>Tất Cả Sản Phẩm</h1>
             <div className={styles.grid}>
                 {products.map((product, index) => (
                     <Card key={index} product={product} />
                 ))}
             </div>
             <div className={styles.pagination}>
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
