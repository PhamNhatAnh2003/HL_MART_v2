import React, { useEffect, useState } from "react";
import {
    Table,
    notification,
    Col,
    Slider,
    Radio,
    Space,
    Row,
    Input,
    Modal,
    InputNumber,
} from "antd";
import axios from "axios";
import Button from "~/components/Button";
import classNames from "classnames/bind";
import styles from "./ProductManage.module.scss";
import { formatPrice } from "~/utils/format";
import { AddProduct, UpdateProduct } from "~/components/Popup";

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu tên tìm kiếm
    const [isShowAddPopup, setIsShowAddPopup] = useState(false);
    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/staff/all_product"
            );
            if (
                response.data?.success &&
                response.data?.products &&
                Array.isArray(response.data.products)
            ) {
                const mappedProducts = response.data.products.map(
                    (product) => ({
                        ...product,
                        key: product.id,
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

    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const response = await axios.delete(
                        `http://127.0.0.1:8000/api/staff/product/delete/${id}`
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

    const handleStockChange = (productId, newStock) => {
        axios
            .post(`http://127.0.0.1:8000/api/products/${productId}/stock`, {
                stock: newStock,
            })
            .then((response) => {
                if (response.status === 200) {
                    notification.success({
                        message: "Cập nhật số lượng thành công",
                    });
                    setProducts((prevProducts) =>
                        prevProducts.map((item) =>
                            item.id === productId
                                ? { ...item, stock: newStock }
                                : item
                        )
                    );
                } else {
                    notification.error({
                        message: "Cập nhật số lượng thất bại",
                    });
                }
            })
            .catch((error) => {
                notification.error({
                    message: "Lỗi cập nhật số lượng: " + error.message,
                });
            });
    };

    const StockInput = ({ stock, productId, onStockChange }) => {
        const [value, setValue] = React.useState(stock);

        React.useEffect(() => {
            setValue(stock);
        }, [stock]);

        const onChange = (val) => {
            setValue(val);
        };

        const updateStock = () => {
            if (value !== stock) {
                onStockChange(productId, value);
            }
        };

        return (
            <InputNumber
                min={0}
                value={value}
                onChange={onChange}
                onPressEnter={updateStock} // Khi nhấn Enter
                onBlur={updateStock} // Khi mất focus (ra khỏi ô input)
                style={{ width: 100 }}
            />
        );
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Lọc sản phẩm theo searchTerm (tên sản phẩm)
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        {
            title: "Số lượng trong kho",
            dataIndex: "stock",
            key: "stock",
            render: (stock, record) => (
                <StockInput
                    stock={stock}
                    productId={record.id}
                    onStockChange={handleStockChange}
                />
            ),
        },
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
                        onClick={() => showDeleteConfirm(product.id)}
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
                />
            )}

            {isShowUpdatePopup && (
                <UpdateProduct
                    productId={isShowUpdatePopup}
                    onReFetch={handleReFetch}
                    onClose={() => setIsShowUpdatePopup(false)}
                />
            )}

            <div style={{ padding: "24px" }}>
                <h2>Danh sách sản phẩm</h2>

                {/* Input tìm kiếm */}
                <Input.Search
                    placeholder="Tìm kiếm theo tên"
                    allowClear
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: 16, maxWidth: 500 }}
                />
                <Button
                                    primary
                                    className={cx("add-button")}
                                    onClick={() => setIsShowAddPopup(true)}
                                >
                                    Thêm sản phẩm
                                </Button>
                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                />
            </div>
        </>
    );
};

export default Dashboard;
