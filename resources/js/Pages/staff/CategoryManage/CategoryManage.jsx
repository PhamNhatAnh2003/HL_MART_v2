import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Alert,
} from "antd";
import styles from "./CategoryManage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const { Option } = Select;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]); // Khởi tạo là mảng rỗng
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState(null); // Thêm state để lưu lỗi

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null); // Reset lỗi trước khi gọi API
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/categories",
            );
            console.log(response.data)
            setCategories(response.data || []); // Đảm bảo categories luôn là mảng
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError("Lỗi khi tải danh mục: " + errorMessage);
            message.error("Lỗi khi tải danh mục: " + errorMessage);
            setCategories([]); // Đặt lại categories để tránh lỗi undefined
        } finally {
            setLoading(false);
        }
    };

    const showModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            form.setFieldsValue({
                name: category.name,
                parent_id: category.parent_id,
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCategory) {
                await axios.put(
                    `http://127.0.0.1:8000/api/update_categories/${editingCategory.id}`,
                    values
                );
                message.success("Cập nhật danh mục thành công");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/create_categories",
                    values
                );
                message.success("Thêm danh mục thành công");
            }
            setIsModalVisible(false);
            fetchCategories();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            message.error("Lỗi: " + errorMessage);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingCategory(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/delete_categories/${id}`
            );
            message.success("Xóa danh mục thành công");
            fetchCategories();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            message.error("Lỗi khi xóa danh mục: " + errorMessage);
        }
    };

    // Chuyển đổi danh mục thành cấu trúc cây để hiển thị
    const buildTree = (categories, parentId = null) => {
        // Kiểm tra categories có tồn tại và là mảng không
        if (!Array.isArray(categories)) {
            return [];
        }

        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => ({
                ...category,
                key: category.id,
                children: buildTree(categories, category.id),
            }));
    };

    const treeData = buildTree(categories);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            // render: (text, record) => (
            //     <span style={{ paddingLeft: record.parent_id ? 20 : 0 }}>
            //         {record.parent_id && "└─ "}
            //         {text}
            //     </span>
            // ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => showModal(record)}
                        style={{ marginRight: 8 }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className={cx("categoryManagement")}>
            <h2>Quản lý Danh mục Sản phẩm</h2>
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            <Button
                type="primary"
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Thêm danh mục
            </Button>
            <Table
                columns={columns}
                dataSource={treeData}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="parent_id" label="Danh mục cha">
                        <Select allowClear placeholder="Chọn danh mục cha">
                            {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
