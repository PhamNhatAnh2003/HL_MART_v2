import { useEffect, useState } from "react";
import { Select, Spin, message, Modal, Button } from "antd";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./VoucherInput.module.scss";
import { formatPrice } from "~/utils/format";

const cx = classNames.bind(styles);
const { Option } = Select;

const VoucherInput = ({ onSelect, totalPrice }) => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVoucher, setModalVoucher] = useState(null);
    const [appliedVoucher, setAppliedVoucher] = useState(null);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/vouchers/available"
                );
                console.log(res.data)
                setVouchers(res.data.vouchers || []);
            } catch (error) {
                message.error("Không thể tải danh sách mã giảm giá.");
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const calculateDiscount = (voucher) => {
        if (!voucher || !totalPrice) return 0;
        let amount =
            voucher.type === "percent"
                ? Math.floor((voucher.value / 100) * totalPrice)
                : Number(voucher.value);

        if (voucher.max_discount_amount) {
            amount = Math.min(amount, voucher.max_discount_amount);
        }

        return amount;
    };

    // Khi chọn voucher trên select => mở modal
    const handleSelectVoucher = (voucherId) => {
        setSelectedVoucherId(voucherId);
        const voucher = vouchers.find((v) => v.id === voucherId);
        if (voucher) {
            const discountAmount = calculateDiscount(voucher);
            setModalVoucher({ ...voucher, discount_amount: discountAmount });
            setModalVisible(true);
        } else {
            // Clear chọn
            setModalVoucher(null);
            setSelectedVoucherId(null);
        }
    };

    // Áp dụng voucher khi nhấn nút Áp dụng trong modal
    const handleApplyVoucher = () => {
        setAppliedVoucher(modalVoucher);
        setModalVisible(false);
        onSelect(modalVoucher);
        message.success("Áp dụng mã giảm giá thành công!");
    };

    // Hủy bỏ modal => không áp dụng
    const handleCancelModal = () => {
        setModalVisible(false);
        setSelectedVoucherId(appliedVoucher ? appliedVoucher.id : null);
        setModalVoucher(null);
    };

    // Xóa voucher đã áp dụng
    const handleClearVoucher = () => {
        setSelectedVoucherId(null);
        setAppliedVoucher(null);
        onSelect(null);
    };

    if (loading) return <Spin />;

    return (
        <div style={{ marginBottom: 0 }}>
            <strong>Chọn mã giảm giá:</strong>
            <Select
                style={{ width: "100%", marginTop: 3 }}
                placeholder="Chọn mã giảm giá"
                onChange={handleSelectVoucher}
                value={selectedVoucherId}
                allowClear
                onClear={handleClearVoucher}
            >
                {vouchers.map((voucher) => (
                    <Option key={voucher.id} value={voucher.id}>
                        {voucher.code} - Giảm{" "}
                        {voucher.type === "percent"
                            ? `${voucher.value}%`
                            : `${Number(voucher.value).toLocaleString()}đ`}
                    </Option>
                ))}
            </Select>

            {/* Modal hiển thị chi tiết voucher */}
            <Modal
                title="Chi tiết mã giảm giá"
                open={modalVisible}
                onOk={handleApplyVoucher}
                onCancel={handleCancelModal}
                okText="Áp dụng"
                cancelText="Hủy"
            >
                {modalVoucher && (
                    <div className={styles.voucherModal}>
                        <p>
                            <strong>Mã:</strong>{" "}
                            <span className={styles.highlight}>
                                {modalVoucher.code}
                            </span>
                        </p>
                        <p>
                            <strong>Tiêu đề:</strong> {modalVoucher.title}
                        </p>
                        <p>
                            <strong>Loại:</strong>{" "}
                            {modalVoucher.type === "percent"
                                ? `Giảm ${modalVoucher.value}%`
                                : `Giảm ${formatPrice(modalVoucher.value)}`}
                        </p>
                        <p>
                            <strong>Điều kiện:</strong> Đơn tối thiểu{" "}
                            {formatPrice(modalVoucher.min_order)}
                        </p>
                        <p>
                            <strong>Mô tả:</strong> {modalVoucher.description}
                        </p>
                        <p>
                            <strong>Thời gian áp dụng:</strong>{" "}
                            <span className={styles.dateRange}>
                                {new Date(
                                    modalVoucher.starts_at
                                ).toLocaleDateString("vi-VN")}{" "}
                                -{" "}
                                {new Date(
                                    modalVoucher.expires_at
                                ).toLocaleDateString("vi-VN")}
                            </span>
                        </p>
                        <p>
                            <strong>Lượt đã dùng:</strong> {modalVoucher.used}/
                            {modalVoucher.max_usage}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VoucherInput;
