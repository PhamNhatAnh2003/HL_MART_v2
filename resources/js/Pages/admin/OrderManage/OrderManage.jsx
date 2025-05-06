import React, { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Input,
    Select,
    DatePicker,
    Button as AntButton,
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

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchName]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders?status=${statusFilter}&name=${searchName}`
            );
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Khách hàng",
            dataIndex: "customer_name",
            key: "customer_name",
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
            render: (status) => {
                const color =
                    status === "Đã giao"
                        ? "green"
                        : status === "Đã huỷ"
                        ? "red"
                        : "orange";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        { title: "Ngày đặt", dataIndex: "created_at", key: "created_at" },
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
                    <Option value="Đang xử lý">Đang xử lý</Option>
                    <Option value="Đã giao">Đã giao</Option>
                    <Option value="Đã huỷ">Đã huỷ</Option>
                </Select>

                <RangePicker className={cx("datePicker")} />

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
