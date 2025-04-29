import React, { useEffect, useState } from "react";
import { Table, notification, Col, Slider, Radio, Space, Row } from "antd";
import axios from "axios";
import Button from "~/components/Button";
import { DefaultInput, Input } from "~/components/Input";
import classNames from "classnames/bind";
import styles from "./ProductManage.module.scss";
import { formatPrice } from "~/utils/format";
import { AddProduct, UpdateProduct } from "~/components/Popup";
import { Modal } from "antd";

const cx = classNames.bind(styles);

const ProductManage = () => {
    const [products, setProducts] = useState([]);

    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [priceRange, setPriceRange] = useState([200000, 80000000]);
    const [isShowAddPopup, setIsShowAddPopup] = useState(false);
    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchProducts();
        fillters();
    }, []);


     const fillters = async () => {
         try {
             const response = await axios.get(
                 `http://127.0.0.1:8000/api/products/filter?category=${category}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&name=${name}`
             );
             if (response.data.success) {
                 setProducts(response.data.data);
             } else {
                 console.error("Failed to fetch products");
             }
         } catch (error) {
             console.error("Error fetching products:", error);
         }
     };


    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const onPriceChange = (value) => {
        setPriceRange(value);
    };

    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const response = await axios.delete(
                        `http://127.0.0.1:8000/api/product/delete/${id}`
                    );
                    if (response.status === 200) {
                        // Cập nhật lại danh sách sản phẩm sau khi xóa
                        setProducts((prevProducts) =>
                            prevProducts.filter((product) => product.id !== id)
                        );
                        notification.success({
                            message: "Sản phẩm đã được xóa thành công!",
                        });
                    } else {
                        notification.error({
                            message: "Xóa sản phẩm thất bại!",
                        });
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    notification.error({
                        message: "Đã xảy ra lỗi khi xóa sản phẩm.",
                    });
                }
            },
        });
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/productlist"
            );
            // console.log(response.data);
            if (
                response.data?.success &&
                response.data?.products &&
                Array.isArray(response.data.products)
            ) {
                const mappedProducts = response.data.products.map(
                    (product) => ({
                        ...product,
                        key: product.id, // thêm key bằng id
                    })
                );
                setProducts(mappedProducts);
            } else {
                console.error("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const isAdmin = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            notification.error({ message: "Không tìm thấy token" });
            return false;
        }
        const decodedToken = jwtDecode(token);
        return decodedToken.role === "admin";
    };

    const handleReFetch = () => {
        fetchProducts();
    };

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            render: (text) => <div className={cx("ellipsis-text")}>{text}</div>,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (text) => <span>{formatPrice(text)}</span>,
        },
        {
            title: "Giá khuyến mãi",
            dataIndex: "discount_price",
            key: "discount",
            render: (text) => <span>{formatPrice(text)}</span>,
        },
        { title: "Số lượng trong kho", dataIndex: "stock", key: "stock" },
        { title: "Loại sản phẩm", dataIndex: "category_name", key: "category" },
        {
            title: "Tác vụ",
            key: "actions",
            render: (_, product) => (
                <Space>
                    <Button
                        primary
                        onClick={() => setIsShowUpdatePopup(product.id)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => showDeleteConfirm(product.id)} // Gọi Modal xác nhận xóa
                    >
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            {isShowAddPopup && (
                <AddProduct
                    onReFetch={handleReFetch}
                    onClose={() => setIsShowAddPopup(false)}
                ></AddProduct>
            )}

            {isShowUpdatePopup && (
                <UpdateProduct
                    productId={isShowUpdatePopup}
                    onReFetch={handleReFetch}
                    onClose={() => setIsShowUpdatePopup(false)}
                ></UpdateProduct>
            )}

            <div className={cx("wrapper")}>
                <h2 className={cx("title")}>Quản lý sản phẩm</h2>

                {/* filter */}
                <Row className={cx("filter-section")}>
                    <Col span={24}>
                        <div className={cx("filter-item")}>
                            <h1 className={cx("filter-label")}>Tên sản phẩm</h1>
                            <DefaultInput
                                placeholder="Tên sản phẩm"
                                value={name}
                                setValue={setName}
                                onChange={onNameChange}
                            />
                            <Col span={24}>
                                <Button
                                    danger
                                    onClick={fillters}
                                    className={cx("search-button")}
                                >
                                    Tìm kiếm
                                </Button>
                            </Col>
                        </div>
                    </Col>

                
                    <Col xl={12} className={cx("filter-item")}>
                        <h1 className={cx("filter-label")}>Tầm Giá</h1>
                        <Slider
                            range
                            min={20000}
                            max={800000}
                            value={priceRange}
                            onChange={onPriceChange}
                            className={cx("price-slider")}
                        />
                        <div className={cx("price-display")}>
                            <span>Giá từ: {formatPrice(priceRange[0])}</span>{" "}
                            <br />
                            <span>Giá đến: {formatPrice(priceRange[1])}</span>
                        </div>
                    </Col> 
                </Row>

                <Button
                    primary
                    className={cx("add-button")}
                    onClick={() => setIsShowAddPopup(true)}
                >
                    Thêm sản phẩm
                </Button>

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                />
            </div>
        </>
    );
};

export default ProductManage;
