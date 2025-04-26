import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Input,
    Form,
    notification,
    Col,
    Slider,
    Radio,
    Space,
    Row,
} from "antd";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ProductManage.module.scss";
import { formatPrice } from "~/utils/format";

const cx = classNames.bind(styles);

const ProductManage = () => {
    const [products, setProducts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [priceRange, setPriceRange] = useState([200000, 80000000]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const onCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const onPriceChange = (value) => {
        setPriceRange(value);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                ``
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

    const isAdmin = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            notification.error({ message: "Không tìm thấy token" });
            return false;
        }
        const decodedToken = jwtDecode(token);
        return decodedToken.role === "admin";
    };

    

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "product_name",
            key: "name",
            render: (text) => <div className={cx("ellipsis-text")}>{text}</div>,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (text) => <span>{text?.toLocaleString()} đ</span>,
        },
        {
            title: "Giá khuyến mãi",
            dataIndex: "discount",
            key: "discount",
            render: (text) => <span>{text}%</span>,
        },
        { title: "Số lượng", dataIndex: "stock", key: "stock" },
        { title: "Loại sản phẩm", dataIndex: "category_name", key: "category" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingProduct(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record.product_id)}
                    >
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <h2 className={cx("title")}>Quản lý sản phẩm</h2>

            {/* filter */}
            <Row className={cx("filter-section")}>
                <Col span={24}>
                    <div className={cx("filter-item")}>
                        <h1 className={cx("filter-label")}>Tên sản phẩm</h1>
                        <Input
                            placeholder="Tên sản phẩm"
                            value={name}
                            onChange={onNameChange}
                        />
                    </div>
                </Col>

                <Col xl={12} className={cx("filter-item")}>
                    <h1 className={cx("filter-label")}>Loại sản phẩm</h1>
                    <Radio.Group
                        buttonStyle="solid"
                        onChange={onCategoryChange}
                        value={category}
                        className={cx("filter-radio-group")}
                    >
                        <Radio value="" className={cx("filter-radio")}>
                            Tất cả
                        </Radio>
                        <Space
                            direction="vertical"
                            size={10}
                            className={cx("filter-radio-space")}
                        >
                            <Radio
                                value="laptop"
                                className={cx("filter-radio")}
                            >
                                Laptop
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Col>

                <Col xl={12} className={cx("filter-item")}>
                    <h1 className={cx("filter-label")}>Tầm Giá</h1>
                    <Slider
                        range
                        min={200000}
                        max={80000000}
                        value={priceRange}
                        onChange={onPriceChange}
                        className={cx("price-slider")}
                    />
                    <div className={cx("price-display")}>
                        <span>
                            Giá từ: {formatPrice(priceRange[0])}
                        </span>{" "}
                        <br />
                        <span>
                            Giá đến: {formatPrice(priceRange[1])}
                        </span>
                    </div>
                </Col>

                <Col span={24}>
                    <Button
                        type="primary"
                        onClick={fetchProducts}
                        className={cx("search-button")}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>

            <Button
                className={cx("add-button")}
                onClick={() => setIsModalVisible(true)}
            >
                Thêm sản phẩm
            </Button>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="product_id"
            />
        </div>
    );
};

export default ProductManage;
