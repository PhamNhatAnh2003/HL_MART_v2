import React, { useEffect, useState } from "react";
import styles from "./BilliardManage.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import { Table, Tag, Button, Modal, Form, Input, Select, message } from "antd";

const cx = classNames.bind(styles);

const BilliardManage = () => {
    const [tables, setTables] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [form] = Form.useForm();

    const fetchTables = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/billiard-tables"
            );
            setTables(res.data.data);
        } catch (err) {
            message.error("Lỗi khi tải danh sách bàn.");
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const openModal = (table = null) => {
        setEditingTable(table);
        form.setFieldsValue(table || { name: "", status: "available" });
        setIsModalOpen(true);
    };


    const handleSubmit = async (values) => {
        try {
            if (editingTable) {
                await axios.put(
                    `http://127.0.0.1:8000/api/admin/billiard-tables/${editingTable.id}`,
                    values
                );
                message.success("Cập nhật thành công!");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/admin/billiard-tables",
                    values
                );
                message.success("Thêm bàn thành công!");
            }
            fetchTables();
            setIsModalOpen(false);
        } catch {
            message.error("Lỗi khi lưu bàn.");
        }
    };

    const columns = [
        { title: "STT", render: (_, __, index) => index + 1 },
        { title: "Tên bàn", dataIndex: "name", key: "name" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "available"
                        ? "green"
                        : status === "reserved"
                        ? "orange"
                        : "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Thời gian vào",
            dataIndex: "start_time",
            key: "start_time",
            render: (value) => (value ? new Date(value).toLocaleString() : "-"),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => openModal(record)} type="link">
                        Sửa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <h2>Quản lý bàn Billiards</h2>
            </div>
            <Table columns={columns} dataSource={tables} rowKey="id" />

            <Modal
                open={isModalOpen}
                title={editingTable ? "Cập nhật bàn" : "Thêm bàn mới"}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu"
                cancelText="Huỷ"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    onValuesChange={(changed, allValues) => {
                        // Cho phép điều chỉnh render khi chọn trạng thái
                        form.setFieldsValue(allValues);
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Tên bàn"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên bàn",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái",
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="available">
                                Available
                            </Select.Option>
                            <Select.Option value="reserved">
                                Reserved
                            </Select.Option>
                            <Select.Option value="using">Using</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Ô nhập thời gian vào khi trạng thái là "using" */}
                    {form.getFieldValue("status") === "using" && (
                        <Form.Item
                            name="start_time"
                            label="Thời gian vào"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập thời gian vào",
                                },
                            ]}
                        >
                            <Input type="datetime-local" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default BilliardManage;
