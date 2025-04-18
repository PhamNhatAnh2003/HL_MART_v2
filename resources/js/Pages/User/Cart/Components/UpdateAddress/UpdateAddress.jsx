import { Modal, Button, Form, Input, Checkbox } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import showToast from "~/components/message";

const UpdateAddress = ({
    visible,
    onCancel,
    onUpdateAddress,
    userId,
    addressId,
}) => {
    const [form] = Form.useForm(); // Form instance to handle form data
    const [loading, setLoading] = useState(false);

    // Fetch the existing address data for editing
    useEffect(() => {
        const fetchAddress = async () => {
            if (addressId) {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/address/${addressId}?user_id=${userId}`
                    );
                    if (response.data.status) {
                        form.setFieldsValue(response.data.data); // Pre-fill the form with the address data
                    } else {
                        showToast("Không tìm thấy địa chỉ để chỉnh sửa!");
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy địa chỉ:", error);
                    showToast("Có lỗi khi lấy dữ liệu địa chỉ.");
                }
            }
        };

        if (visible && addressId) {
            fetchAddress();
        }
    }, [visible, addressId, userId, form]);

    // Handle update address
   const handleUpdateAddress = async (values) => {
       if (!addressId) {
           showToast("Thiếu mã địa chỉ để cập nhật.");
           return;
       }

       setLoading(true);
       try {
           const response = await axios.post(
               `http://127.0.0.1:8000/api/address/update/${addressId}`,
               {
                   ...values,
                   user_id: userId, // gửi kèm user_id trong body
               }
           );

           if (response.data.status) {
               showToast("Địa chỉ đã được cập nhật!");
               onUpdateAddress(response.data.data); // Pass updated address to parent
               form.resetFields();
               onCancel();
           } else {
               showToast("Cập nhật địa chỉ thất bại. Vui lòng thử lại!");
           }
       } catch (error) {
           console.error("Lỗi khi cập nhật địa chỉ:", error);
           showToast("Có lỗi khi cập nhật địa chỉ. Vui lòng thử lại!");
       } finally {
           setLoading(false);
       }
   };

    return (
        <Modal
            title="Cập nhật địa chỉ"
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
                    loading={loading}
                >
                    Cập nhật địa chỉ
                </Button>,
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateAddress}
                layout="vertical"
                initialValues={{
                    receiver_name: "",
                    phone: "",
                    street_address: "",
                    ward: "",
                    district: "",
                    province: "",
                    is_default: false,
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

export default UpdateAddress;
