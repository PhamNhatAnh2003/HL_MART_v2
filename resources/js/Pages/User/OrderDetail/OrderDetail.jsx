import React, { useEffect, useState, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./OrderDetail.module.scss";
import axios from "axios";
import { AuthContext } from "~/context/AuthContext";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button"
import { Table, Tag, Modal, Empty } from "antd"; // thêm Modal và Button

const cx = classNames.bind(styles);

const OrderDetail = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isOrderCancelModalOpen, setIsOrderCancelModalOpen] = useState(false);
    const [isBookingCancelModalOpen, setIsBookingCancelModalOpen] =
        useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);


    const fetchMyBookings = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/my-bookings",
                {
                    params: { user_id: user.id },
                }
            );
            setBookings(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đặt bàn:", err);
        }
    };

    useEffect(() => {
        if (user?.id) fetchMyBookings();
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/orders/user/${user?.id}`
                );
                console.log(response.data)
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
                // window.location.reload();
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
            setIsOrderCancelModalOpen(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!bookingId) {
            alert("Đặt bàn không hợp lệ.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/cancel-booking", {
                booking_id: bookingId,
                user_id: user?.id,
            });
            alert("Huỷ đặt bàn thành công!");
            setIsBookingCancelModalOpen(false);
            fetchMyBookings(); // reload lại danh sách
        } catch (err) {
            console.error("Lỗi huỷ đặt bàn:", err);
        }
    };


    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (text, record, index) => index + 1,
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
                let color;

                // Điều kiện màu sắc cho từng trạng thái
                if (status === "cancelled") {
                    color = "red";
                } else if (status === "completed") {
                    color = "green";
                } else if (status === "shipping") {
                    color = "orange"; // Màu cam cho "Đang giao hàng"
                } else {
                    color = "blue"; // Màu mặc định nếu trạng thái khác
                }

                // Trả về trạng thái và màu sắc tương ứng
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
                            // setIsOrderCancelModalOpen(true);
                        }}
                    >
                        Huỷ đơn hàng
                    </Button>
                ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <div className={cx("first")}>
                <h2>Theo dõi đơn hàng</h2>
                {orders.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: { cursor: "pointer" },
                        })}
                    />
                ) : (
                    <Empty description="Chưa có đơn hàng nào." />
                )}
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
                                    setIsOrderCancelModalOpen(true);
                                }}
                            >
                                Huỷ đơn hàng
                            </Button>
                        </div>
                    )}
                </Modal>
                <Modal
                    title="Xác nhận huỷ đơn hàng"
                    open={isOrderCancelModalOpen}
                    onCancel={() => setIsOrderCancelModalOpen(false)}
                    onOk={() => handleCancelOrder(selectedOrderId)}
                    okText="Xác nhận"
                    cancelText="Huỷ"
                    centered
                >
                    <p>Bạn có chắc chắn muốn huỷ đơn hàng này không?</p>
                </Modal>
            </div>
            <div className={cx("second")}>
                <h2>Đặt bàn</h2>
                {bookings.length > 0 ? (
                    <Table
                        columns={[
                            {
                                title: "STT",
                                key: "stt",
                                render: (text, record, index) => index + 1,
                            },
                            {
                                title: "Tên bàn",
                                dataIndex: ["billiard_table", "name"],
                                key: "table_name",
                            },
                            {
                                title: "Giờ đặt",
                                dataIndex: "booking_time",
                                key: "booking_time",
                            },
                            {
                                title: "Trạng thái",
                                dataIndex: "status",
                                key: "status",
                                render: (status) => {
                                    const color =
                                        status === "reserved"
                                            ? "orange"
                                            : status === "using"
                                            ? "green"
                                            : "gray";
                                    const label =
                                        status === "reserved"
                                            ? "Đã đặt"
                                            : status === "using"
                                            ? "Đang dùng"
                                            : "Đã xong";
                                    return (
                                        <span style={{ color }}>{label}</span>
                                    );
                                },
                            },
                            {
                                title: "Thao tác",
                                key: "actions",
                                render: (_, record) => {
                                    // Kiểm tra trạng thái "reserved" để hiển thị nút huỷ
                                    if (record.status === "reserved") {
                                        return (
                                            <Button
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngừng sự kiện click để tránh mở modal chi tiết
                                                    setSelectedBookingId(
                                                        record.id
                                                    ); // Lưu id của đặt bàn
                                                    setIsBookingCancelModalOpen(
                                                        true
                                                    ); // Mở modal huỷ đặt bàn
                                                }}
                                            >
                                                Huỷ đặt bàn
                                            </Button>
                                        );
                                    }
                                    return null; // Trả về null nếu không phải trạng thái "reserved"
                                },
                            },
                        ]}
                        dataSource={bookings}
                        rowKey="id"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: { cursor: "pointer" },
                        })}
                    />
                ) : (
                    <Empty description="Chưa có đặt bàn nào." />
                )}
                <Modal
                    title="Xác nhận huỷ đặt bàn"
                    open={isBookingCancelModalOpen}
                    onCancel={() => setIsBookingCancelModalOpen(false)}
                    onOk={() => handleCancelBooking(selectedBookingId)}
                    okText="Xác nhận"
                    cancelText="Huỷ"
                    centered
                >
                    <p>Bạn có chắc chắn muốn huỷ đặt bàn này không?</p>
                </Modal>
            </div>
        </div>
    );
};

export default OrderDetail;
