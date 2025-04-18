import { Modal, Button, Form, Input, Checkbox } from "antd"; // Thêm Checkbox
import { useState } from "react";
import axios from "axios";
import showToast from "~/components/message";

const AddAddress = ({ visible, onCancel, onAddAddress, userId }) => {
    const [form] = Form.useForm(); // Form instance to handle form data

    // Hàm gửi thông tin địa chỉ mới
    const handleAddAddress = async (values) => {
        try {
            // Gửi yêu cầu API để thêm địa chỉ mới
            const response = await axios.post(
                `http://127.0.0.1:8000/api/add-address?user_id=${userId}`,
                values
            );

            if (response.data.status) {
                showToast("Địa chỉ đã được thêm thành công!");
                onAddAddress(response.data.data); // Truyền địa chỉ mới cho component cha
                form.resetFields(); // Reset form sau khi thêm thành công
                onCancel(); // Đóng modal
            } else {
                showToast("Thêm địa chỉ thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            showToast("Có lỗi khi thêm địa chỉ. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            title="Thêm địa chỉ mới"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => form.submit()}
                >
                    Thêm địa chỉ
                </Button>,
            ]}
        >
            <Form
                form={form}
                onFinish={handleAddAddress}
                layout="vertical"
                initialValues={{
                    receiver_name: "",
                    phone: "",
                    street_address: "",
                    ward: "",
                    district: "",
                    province: "",
                    is_default: false, // Default là không mặc định
                }}
            >
                <Form.Item
                    label="Tên người nhận"
                    name="receiver_name"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                        },
                        {
                            pattern: /^[0-9]{10}$/,
                            message: "Số điện thoại không hợp lệ",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="street_address"
                    rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[
                        { required: true, message: "Vui lòng nhập phường/xã" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[
                        { required: true, message: "Vui lòng nhập quận/huyện" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tỉnh/Thành phố"
                    name="province"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tỉnh/thành phố",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* Checkbox mặc định */}
                <Form.Item name="is_default" valuePropName="checked">
                    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAddress;
