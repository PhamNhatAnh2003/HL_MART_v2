import React, { useEffect, useState } from "react";
import styles from "./VoucherManage.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import Button from "~/components/Button";
import {
    Table,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Switch,
    message,
    Space,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

const VoucherManage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [form] = Form.useForm();

    const fetchVouchers = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/admin/vouchers"
            );
            console.log(res.data)
            setVouchers(res.data.vouchers);
        } catch (err) {
            message.error("Lỗi khi tải danh sách voucher.");
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleSubmit = async (values) => {
        const [starts_at, expires_at] = values.range;
        const payload = {
            ...values,
            starts_at: starts_at.format("YYYY-MM-DD HH:mm:ss"),
            expires_at: expires_at.format("YYYY-MM-DD HH:mm:ss"),
        };

        try {
            if (editingTable) {
                await axios.put(
                    `http://127.0.0.1:8000/api/vouchers/${editingTable.id}`,
                    payload
                );
                message.success("Cập nhật thành công");
            } else {
                await axios.post("http://127.0.0.1:8000/api/vouchers", payload);
                message.success("Tạo voucher thành công");
            }

            form.resetFields();
            setIsModalOpen(false);
            setEditingTable(null);
            fetchVouchers();
        } catch (err) {
            message.error("Lưu voucher thất bại");
        }
    };

    const deleteVoucher = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/vouchers/${id}`);
            message.success("Xóa voucher thành công");
            fetchVouchers();
        } catch (err) {
            message.error("Xóa thất bại");
        }
    };

    const openCreateModal = () => {
        form.resetFields();
        setEditingTable(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        form.setFieldsValue({
            ...record,
            range: [dayjs(record.starts_at), dayjs(record.expires_at)],
        });
        setEditingTable(record);
        setIsModalOpen(true);
    };

    const columns = [
        { title: "STT", render: (_, __, index) => index + 1 },
        { title: "Code", dataIndex: "code" },
        { title: "Tiêu đề", dataIndex: "title" },
        { title: "Mô tả", dataIndex: "description" },
        {
            title: "Loại",
            dataIndex: "type",
            render: (type) => (type === "percent" ? "Phần trăm" : "Cố định"),
        },
        {
            title: "Giá trị",
            render: (_, r) =>
                r.type === "percent"
                    ? `${r.value}%`
                    : Number(r.value).toLocaleString("vi-VN") + "₫",
        },
        {
            title: "Đơn tối thiểu",
            dataIndex: "min_order",
            render: (v) => Number(v).toLocaleString("vi-VN") + "₫",
        },
        {
            title: "Áp dụng",
            render: (_, r) =>
                `${r.starts_at.slice(0, 10)} → ${r.expires_at.slice(0, 10)}`,
        },
        {
            title: "Đã dùng / Tối đa",
            render: (_, r) => `${r.used}/${r.max_usage}`,
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            render: (a) => (
                <span style={{ color: a ? "green" : "red" }}>
                    {a ? "Đang hoạt động" : "Ngưng"}
                </span>
            ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Button primary onClick={() => openEditModal(record)}>
                        Sửa
                    </Button>
                    <Button danger onClick={() => deleteVoucher(record.id)}>
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <h2>Quản lý mã giảm giá</h2>
                <Button primary onClick={openCreateModal}>
                    + Thêm voucher
                </Button>
            </div>

            <Table columns={columns} dataSource={vouchers} rowKey="id" />

            <Modal
                title={editingTable ? "Cập nhật Voucher" : "Tạo mới Voucher"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingTable(null);
                }}
                onOk={() => form.submit()}
                okText={editingTable ? "Lưu" : "Tạo"}
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ is_active: true }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Mã giảm giá"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "fixed", label: "Cố định" },
                                { value: "percent", label: "Phần trăm" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Giá trị"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="min_order" label="Đơn tối thiểu">
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="max_usage"
                        label="Số lượt tối đa"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="range"
                        label="Thời gian áp dụng"
                        rules={[{ required: true, message: "Chọn thời gian" }]}
                    >
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        name="is_active"
                        label="Hoạt động"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherManage;
