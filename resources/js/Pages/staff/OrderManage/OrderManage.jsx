import React, { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Input,
    Select,
    DatePicker,
    Button as AntButton,
    message,
} from "antd";
import axios from "axios";
import styles from "./OrderManage.module.scss";
import classNames from "classnames/bind";

const { Option } = Select;
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

const OrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchName, setSearchName] = useState("");
    const [dateRange, setDateRange] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchName, dateRange]);

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

    const handleStatusChange = async (orderId, newStatus, note = "") => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/orders/${orderId}/status`,
                { status: newStatus, note }
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
            render: (text) => `${text.toLocaleString()} đ`,
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
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (note, record) => (
                <Input.TextArea
                    defaultValue={note}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    onBlur={(e) =>
                        handleStatusChange(
                            record.id,
                            record.status,
                            e.target.value
                        )
                    }
                    placeholder="Nhập ghi chú"
                />
            ),
        },
        {
            title: "Ngày đặt",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => <AntButton>Xem</AntButton>,
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
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className={cx("select")}
                    allowClear
                    placeholder="Lọc theo trạng thái"
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
        </div>
    );
};

export default OrderManage;
