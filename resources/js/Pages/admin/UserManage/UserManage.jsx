import React, { useEffect, useState } from "react";
import { Table, Modal, Input, notification } from "antd";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./userManage.module.scss";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";

const cx = classNames.bind(styles);

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [emailFilter, setEmailFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [addressFilter, setAddressFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [emailFilter, addressFilter, phoneFilter, nameFilter]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/users?name=${nameFilter}&email=${emailFilter}&address=${addressFilter}&phone=${phoneFilter}`
            );
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDelete = (userId) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xoá người dùng này?",
            onOk: async () => {
                try {
                    const response = await axios.delete(
                        `http://127.0.0.1:8000/api/users/${userId}`
                    );
                    if (response.data.success) {
                        notification.success({ message: "Xoá thành công" });
                        fetchUsers();
                    } else {
                        notification.error({ message: "Xoá thất bại" });
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    notification.error({
                        message: "Xoá thất bại",
                        description:
                            error.response?.data?.message ||
                            "Đã xảy ra lỗi bất ngờ",
                    });
                }
            },
        });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên người dùng", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <span className={cx("actions")}>
                    <Button
                        className={cx("btn")}
                        primary
                        onClick={() => {
                            setSelectedUser(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Xem
                    </Button>
                    <Button
                        className={cx("btn")}
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Xoá
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <h2 className={cx("title")}>Quản lý người dùng</h2>
            <div className={cx("filters")}>
                <Input
                    placeholder="Lọc theo Tên"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className={cx("input")}
                />
                <Input
                    placeholder="Lọc theo Email"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className={cx("input")}
                />
                <Input
                    placeholder="Lọc theo Địa chỉ"
                    value={addressFilter}
                    onChange={(e) => setAddressFilter(e.target.value)}
                    className={cx("input")}
                />
                <Input
                    placeholder="Lọc theo Số điện thoại"
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    className={cx("input")}
                />
            </div>

            <Table columns={columns} dataSource={users} rowKey="id" />

            <Modal
                title="Chi tiết người dùng"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedUser && (
                    <div className={cx("modalContent")}>
                        <p>
                            <strong>ID:</strong> {selectedUser.id}
                        </p>
                        <p>
                            <strong>User-name:</strong> {selectedUser.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> {selectedUser.address}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> {selectedUser.phone}
                        </p>
                        <h3>Giỏ hàng:</h3>
                        {selectedUser.cart_items &&
                        selectedUser.cart_items.length > 0 ? (
                            selectedUser.cart_items.map((cartItem) => (
                                <div
                                    key={cartItem.id}
                                    className={cx("cartItem")}
                                >
                                    <p>
                                        <strong>ID:</strong> {cartItem.id}
                                    </p>
                                    <p>
                                        <strong>Tên sản phẩm:</strong>{" "}
                                        {cartItem.product.name}
                                    </p>
                                    <p>
                                        <strong>Số lượng:</strong>{" "}
                                        {cartItem.quantity}
                                    </p>
                                    <p>
                                        <strong>Giá:</strong>
                                        {cartItem.product.discount_price > 0 ? (
                                            <>
                                                <span
                                                    style={{
                                                        textDecoration:
                                                            "line-through",
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    {formatPrice(
                                                        cartItem.product.price
                                                    )}
                                                </span>
                                                <span style={{ color: "red" }}>
                                                    {formatPrice(
                                                        cartItem.product
                                                            .discount_price
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <span>
                                                {formatPrice(
                                                    cartItem.product.price
                                                )}
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        <strong>Danh mục:</strong>{" "}
                                        {cartItem.product.category_name}
                                    </p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>Giỏ hàng trống</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManage;
