import classNames from "classnames/bind";
import styles from "./CartStep3.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import config from "~/config";
import useProfile from "~/hooks/useProfile";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "~/context/AuthContext";
import axios from "axios";
import { Table, Radio, Modal } from "antd";
import images from "~/assets/images";
import showToast from "~/components/message";

const cx = classNames.bind(styles);

const CartStep3 = () => {
    const { user: loginedProfile } = useContext(AuthContext);
    const { profile, setProfile } = useProfile();
    const { cart } = useCart();
    const [showQrModal, setShowQrModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const itemIds = queryParams.get("items")?.split(",") || [];
    const totalPrice = queryParams.get("totalPrice") || 0;

    const filteredCart = useMemo(() => {
        if (itemIds.length === 0) return cart;
        return (
            cart?.filter((item) =>
                itemIds.includes(item.product.id.toString())
            ) || []
        );
    }, [cart, itemIds]);

    const totalProducts = filteredCart.length;
    const totalQuantity = filteredCart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    useEffect(() => {
        setProfile(loginedProfile);
    }, [loginedProfile]);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleCreateOrder = async () => {
        if (!selectedPaymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (!filteredCart.length) {
            alert("Giỏ hàng không có sản phẩm.");
            return;
        }

        if (!totalPrice || totalPrice <= 0) {
            alert("Giá trị tổng đơn hàng không hợp lệ.");
            return;
        }

        if (!profile?.default_address) {
            alert("Vui lòng cung cấp địa chỉ giao hàng.");
            return;
        }

        if (selectedPaymentMethod === "vnpay") {
            // Gọi API VNPay để lấy URL thanh toán
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/vnpay-payment",
                    {
                        user_id: loginedProfile?.id,
                        amount: totalPrice,
                        shipping_address: [
                            profile?.default_address?.street_address,
                            profile?.default_address?.ward,
                            profile?.default_address?.district,
                            profile?.default_address?.province,
                        ]
                            .filter(Boolean)
                            .join(", "),
                        items: filteredCart.map((item) => ({
                            product_id: item.product.id,
                            quantity: item.quantity,
                            price_at_time:
                                item.product.discount_price ||
                                item.product.price,
                        })),
                    }
                );
                console.log("Response from API:", response.data);

                const paymentUrl = response.data.payment_url;
                if (paymentUrl) {
                    // Chuyển hướng đến URL thanh toán VNPay
                    window.location.href = paymentUrl;
                } else {
                    alert("Không thể tạo URL thanh toán VNPay.");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API VNPay:", error);
                alert("Có lỗi xảy ra khi tạo thanh toán VNPay!");
            }
        } else if (selectedPaymentMethod === "CK") {
            setShowQrModal(true); // Hiển thị modal QR cho chuyển khoản
        } else {
            submitOrder(); // Xử lý các phương thức khác
        }
    };

    const submitOrder = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/create-order",
                {
                    user_id: loginedProfile?.id,
                    payment_method: selectedPaymentMethod,
                    items: filteredCart.map((item) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                        price_at_time:
                            item.product.discount_price || item.product.price,
                    })),
                    total_price: totalPrice,
                    shipping_address: [
                        profile?.default_address?.street_address,
                        profile?.default_address?.ward,
                        profile?.default_address?.district,
                        profile?.default_address?.province,
                    ]
                        .filter(Boolean)
                        .join(", "),
                }
            );

            if (response.data.status) {
                showToast("Đặt hàng thành công!");
                navigate("/order-success");
            } else {
                alert("Có lỗi xảy ra khi tạo đơn hàng!");
            }
        } catch (error) {
            console.error(
                "Lỗi khi tạo đơn hàng:",
                error.response?.data || error.message
            );
            alert("Đặt hàng thất bại.");
        }
    };

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (_, record) => {
                if (record.hasDiscount) {
                    return (
                        <span>
                            <span
                                style={{ color: "#ff4d4f", fontWeight: "bold" }}
                            >
                                {formatPrice(record.price)}
                            </span>{" "}
                            <span
                                style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: 8,
                                }}
                            >
                                {formatPrice(record.originalPrice)}
                            </span>
                        </span>
                    );
                }
                return <span>{formatPrice(record.price)}</span>;
            },
        },
    ];

    const data = filteredCart.map((item) => ({
        key: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
        originalPrice: item.product.price,
        hasDiscount: !!item.product.discount_price,
    }));

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={3} />
                <div className={cx("cart-content")}>
                    <h2>Thông tin khách hàng</h2>
                    <div className={cx("profile-info")}>
                        <div>
                            <strong>Tên:</strong> {profile?.name}
                        </div>
                        <div>
                            <strong>Email:</strong> {profile?.email}
                        </div>
                        <div>
                            {profile?.default_address ? (
                                <>
                                    <div>
                                        <strong>Người nhận:</strong>{" "}
                                        {
                                            profile?.default_address
                                                ?.receiver_name
                                        }
                                    </div>
                                    <div>
                                        <strong>SĐT:</strong>{" "}
                                        {profile?.default_address?.phone}
                                    </div>
                                    <div>
                                        <strong>Địa chỉ:</strong>{" "}
                                        {`${profile?.default_address?.street_address}, ${profile?.default_address?.ward}, ${profile?.default_address?.district}, ${profile?.default_address?.province}`}
                                    </div>
                                </>
                            ) : (
                                <span>Chưa có địa chỉ giao hàng</span>
                            )}
                        </div>
                    </div>
                    <h2>Chi tiết đơn hàng</h2>
                    <div className={cx("order-items")}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={true}
                        />

                        <h2>Chọn phương thức thanh toán</h2>
                        <form className={cx("payment-methods")}>
                            <label>
                                <Radio
                                    value="CK"
                                    checked={selectedPaymentMethod === "CK"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Thanh toán bằng chuyển khoản
                            </label>
                            <label>
                                <Radio
                                    value="vnpay"
                                    checked={selectedPaymentMethod === "vnpay"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Thanh toán qua VNPay
                            </label>
                            <label>
                                <Radio
                                    value="cash_on_delivery"
                                    checked={
                                        selectedPaymentMethod ===
                                        "cash_on_delivery"
                                    }
                                    onChange={handlePaymentMethodChange}
                                />
                                Thanh toán khi nhận hàng
                            </label>
                        </form>
                    </div>
                </div>
            </div>
            <div className={cx("cart-right")}>
                <h2>Tóm tắt đơn hàng</h2>
                <div className={cx("cart-right-line")}>
                    <span>Tổng sản phẩm:</span>
                    <span>{totalProducts}</span>
                </div>
                <div className={cx("cart-right-line")}>
                    <span>Tổng số lượng:</span>
                    <span>{totalQuantity}</span>
                </div>
                <div className={cx("cart-right-line")}>
                    <span>Tổng tiền:</span>
                    <span style={{ fontWeight: 600 }}>
                        {formatPrice(totalPrice)}
                    </span>
                </div>
                <div className={cx("cart-right-last-line")}></div>
                <Button
                    primary
                    large
                    width="100%"
                    onClick={handleCreateOrder}
                    className={cx("order-button")}
                >
                    Xác nhận đặt hàng
                </Button>
            </div>
            <Modal
                title="Quét mã QR để thanh toán"
                open={showQrModal}
                onCancel={() => setShowQrModal(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: "center" }}>
                    <img
                        src={images.image}
                        alt="Mã QR"
                        style={{
                            width: "100%",
                            maxWidth: 360,
                            marginBottom: 16,
                        }}
                    />
                    <p style={{ fontWeight: 500 }}>
                        Vui lòng quét mã để thanh toán.
                        <Button
                            primary
                            onClick={() => {
                                setShowQrModal(false);
                                submitOrder();
                            }}
                        >
                            Hoàn thành
                        </Button>
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default CartStep3;
