import React, { useEffect, useState, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./OrderDetail.module.scss";
import axios from "axios";
import { AuthContext } from "~/context/AuthContext";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button"
import { Table, Tag, Modal } from "antd"; // thêm Modal và Button

const cx = classNames.bind(styles);

const OrderDetail = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/orders/user/${user?.id}`
                );
                setOrders(response.data.orders);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            }
        };

        if (user?.id) fetchOrders();
    }, [user]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders/${orderId}`
            );
            console.log(response.data)
            setOrderDetails(response.data.order_items);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        }
    };

    const handleRowClick = (record) => {
        setSelectedOrder(record);
        fetchOrderDetails(record.id);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/api/orders/${orderId}/cancel`
            );
            if (res.data.success) {
                alert("Đơn hàng đã được huỷ!");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? { ...order, status: "cancelled" }
                            : order
                    )
                );
            } else {
                alert("Không thể huỷ đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi huỷ đơn hàng:", error);
            alert("Có lỗi xảy ra khi huỷ đơn hàng.");
        } finally {
            setIsCancelModalOpen(false);
        }
    };

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ngày đặt",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            render: (price) => formatPrice(price),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "cancelled"
                        ? "red"
                        : status === "completed"
                        ? "green"
                        : "blue";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) =>
                record.status === "pending" && (
                    <Button
                        danger
                        onClick={() => {
                            setSelectedOrderId(record.id);
                            setIsCancelModalOpen(true);
                        }}
                    >
                        Huỷ đơn hàng
                    </Button>
                ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <h2>Theo dõi đơn hàng</h2>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={!!selectedOrder}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
            >
                {orderDetails && orderDetails.length > 0 ? ( // Kiểm tra orderDetails có tồn tại và có phần tử
                    <Table
                        dataSource={orderDetails}
                        rowKey="id"
                        pagination={false}
                        columns={[
                            {
                                title: "Sản phẩm",
                                dataIndex: "product_name",
                                key: "product_name",
                            },
                            {
                                title: "Số lượng",
                                dataIndex: "quantity",
                                key: "quantity",
                            },
                            {
                                title: "Giá tiền",
                                dataIndex: "price_at_time",
                                key: "price_at_time",
                                render: (price) => formatPrice(price),
                            },
                        ]}
                    />
                ) : (
                    <p>Không có dữ liệu.</p> // Hiển thị thông báo nếu không có dữ liệu
                )}

                {/* Phần hiển thị nút huỷ đơn hàng */}
                {selectedOrder?.status === "pending" && (
                    <div style={{ marginTop: 16 }}>
                        <Button
                            danger
                            onClick={() => {
                                setSelectedOrderId(selectedOrder.id);
                                setIsCancelModalOpen(true);
                            }}
                        >
                            Huỷ đơn hàng
                        </Button>
                    </div>
                )}
            </Modal>
            <Modal
                title="Xác nhận huỷ đơn hàng"
                open={isCancelModalOpen}
                onCancel={() => setIsCancelModalOpen(false)}
                onOk={() => handleCancelOrder(selectedOrderId)}
                okText="Xác nhận"
                cancelText="Huỷ"
                centered
            >
                <p>Bạn có chắc chắn muốn huỷ đơn hàng này không?</p>
            </Modal>
        </div>
    );
};

export default OrderDetail;
