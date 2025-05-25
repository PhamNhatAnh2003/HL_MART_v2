import React, { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Input,
    Select,
    DatePicker,
    Button as AntButton,
    message,
    Modal,
    Space
} from "antd";
import Button from "~/components/Button";
import axios from "axios";
import styles from "./OrderManage.module.scss";
import { formatPrice } from "~/utils/format";
import classNames from "classnames/bind";

const { Option } = Select;
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

const OrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchName, setSearchName] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // đơn hàng được chọn
    const [orderDetails, setOrderDetails] = useState([]); // chi tiết sản phẩm trong đơn hàng

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchName, dateRange]);

    const showDeleteModal = (e, orderId) => {
        e.stopPropagation();
        setOrderIdToDelete(orderId);
        setIsModalVisible(true);
    };

    const fetchOrders = async () => {
        try {
            const [start, end] = dateRange || [];
            const params = {
                status: statusFilter,
                name: searchName,
                start_date: start ? start.format("YYYY-MM-DD") : undefined,
                end_date: end ? end.format("YYYY-MM-DD") : undefined,
            };
            const response = await axios.get(
                "http://127.0.0.1:8000/api/orders",
                {
                    params,
                }
            );
               console.log(response.data);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/orders/${orderId}/status`,
                { status: newStatus }
            );
            if (response.data.success) {
                message.success("Trạng thái đơn hàng đã được cập nhật!");
                fetchOrders(); // Tải lại danh sách đơn hàng
            } else {
                message.error("Cập nhật trạng thái thất bại.");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`/api/admin/orders/${orderId}`);
            console.log(response.data)
            setOrderDetails(response.data.data); // hoặc response.data tuỳ theo cấu trúc
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            setOrderDetails([]); // reset nếu lỗi
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/admin/orders/${orderIdToDelete}`
            );
            message.success("Xóa đơn hàng thành công");
            setIsModalVisible(false);
            setOrderIdToDelete(null);
            fetchOrders(); // reload danh sách đơn hàng
        } catch (error) {
            message.error("Xóa đơn hàng thất bại");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Người Nhận",
            dataIndex: "receiver_name",
            key: "receiver_name",
        },
        { title: "SĐT", dataIndex: "phone", key: "phone" },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            render: (total_price) => formatPrice(total_price),
        },
        {
            title: "Thanh toán",
            dataIndex: "payment_method",
            key: "payment_method",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const color =
                    status === "Đã giao"
                        ? "green"
                        : status === "Đã huỷ"
                        ? "red"
                        : "orange";
                return (
                    <Select
                        value={status}
                        style={{ width: 120 }}
                        onChange={(newStatus) =>
                            handleStatusChange(record.id, newStatus)
                        }
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="shipping">Shipping</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>
                );
            },
        },
        {
            title: "Ngày đặt",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Địa chỉ nhận hàng",
            dataIndex: "shipping_address",
            key: "shipping_address",
        },
        {
            title: "Hành động",
            key: "action",
            width: 10,
            render: (_, record) => (
                <div style={{ gap: 2 }}>
                    <Space>
                        <Button
                            primary
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(record);
                                fetchOrderDetails(record.id);
                            }}
                        >
                            Xem
                        </Button>
                        <Button
                            danger
                            onClick={(e) => showDeleteModal(e, record.id)}
                        >
                            Xoá
                        </Button>
                    </Space>
                </div>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <h2 className={cx("title")}>Quản lý đơn hàng</h2>

            <div className={cx("filters")}>
                <Input
                    placeholder="Tìm theo tên khách"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className={cx("input")}
                />

                <Select
                    placeholder="Lọc theo trạng thái"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className={cx("select")}
                    allowClear
                >
                    <Option value="pending">Pending</Option>
                    <Option value="shipping">Shipping</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>

                <RangePicker
                    className={cx("datePicker")}
                    onChange={(dates) => setDateRange(dates)}
                />

                <AntButton type="primary" onClick={fetchOrders}>
                    Lọc
                </AntButton>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                className={cx("table")}
            />
            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={!!selectedOrder}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
            >
                {orderDetails && orderDetails.length > 0 ? (
                    <Table
                        dataSource={orderDetails}
                        rowKey={(record) => record.order_item_id}
                        pagination={false}
                        columns={[
                            {
                                title: "Sản phẩm",
                                dataIndex: "product_name",
                                key: "product_name",
                            },
                            {
                                title: "Hình ảnh",
                                dataIndex: "avatar",
                                key: "avatar",
                                render: (avatar) => (
                                    <img
                                        src={avatar}
                                        alt="Hình ảnh"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                ),
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
                    <p>Không có dữ liệu.</p>
                )}
            </Modal>
            <Modal
                title="Xác nhận xóa đơn hàng"
                open={isModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => {
                    setIsModalVisible(false);
                    setOrderIdToDelete(null);
                }}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc muốn xóa đơn hàng này không?</p>
            </Modal>
        </div>
    );
};

export default OrderManage;
