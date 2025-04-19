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

const cx = classNames.bind(styles);

const CartStep3 = () => {
    const { profile: loginedProfile } = useContext(AuthContext);
    const { profile, setProfile } = useProfile();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy danh sách ID sản phẩm từ query
    const queryParams = new URLSearchParams(location.search);
    const itemIds = queryParams.get("items")?.split(",") || [];
    const totalPrice = queryParams.get("totalPrice") || 0;

    // Lọc giỏ hàng theo itemIds
    const filteredCart = useMemo(() => {
        if (itemIds.length === 0) return cart;
        return (
            cart?.filter((item) =>
                itemIds.includes(item.product.id.toString())
            ) || []
        );
    }, [cart, itemIds]);

    // Tính tổng
    const totalProducts = filteredCart.length;
    const totalQuantity = filteredCart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );


    useEffect(() => {
        setProfile(loginedProfile);
    }, [loginedProfile]);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [orderDetails, setOrderDetails] = useState({
        // Các thông tin đơn hàng (Sản phẩm, giá trị, địa chỉ giao hàng, v.v.)
        items: [],
        totalPrice: 0,
        shippingAddress: "",
    });

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleCreateOrder = async () => {
        if (!selectedPaymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        try {
            // Gửi yêu cầu tạo đơn hàng lên backend
            const response = await axios.post(
                "http://127.0.0.1:8000/api/create-order",
                {
                    payment_method: selectedPaymentMethod,
                    items: orderDetails.items,
                    total_price: orderDetails.totalPrice,
                    shipping_address: orderDetails.shippingAddress,
                }
            );

            if (response.data.status) {
                alert("Đơn hàng đã được tạo thành công!");
                // Điều hướng đến trang thanh toán hoặc trang xác nhận đơn hàng
            } else {
                alert("Có lỗi xảy ra khi tạo đơn hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            alert("Có lỗi xảy ra khi tạo đơn hàng.");
        }
    };


    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={3} />
                <div className={cx("cart-content")}>
                    <div className={cx("cart-right")}>
                        <h1>Chọn phương thức thanh toán</h1>
                        <form>
                            <label>
                                <input
                                    type="radio"
                                    value="momo"
                                    checked={selectedPaymentMethod === "momo"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Momo
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    value="credit_card"
                                    checked={
                                        selectedPaymentMethod === "credit_card"
                                    }
                                    onChange={handlePaymentMethodChange}
                                />
                                Thẻ tín dụng
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    value="cash_on_delivery"
                                    checked={
                                        selectedPaymentMethod ===
                                        "cash_on_delivery"
                                    }
                                    onChange={handlePaymentMethodChange}
                                />
                                Thanh toán khi nhận hàng
                            </label>
                            <br />

                            <button type="button" onClick={handleCreateOrder}>
                                Tạo đơn hàng
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className={cx("cart-right")}>
                <h2>Tổng tiền giỏ hàng</h2>
                <div className={cx("cart-right-line")}>
                    <span>Tổng sản phẩm: </span>
                    <span>{totalProducts}</span>
                </div>
                <div className={cx("cart-right-line")}>
                    <span>Tổng số lượng: </span>
                    <span>{totalQuantity}</span>
                </div>
                <div className={cx("cart-right-line")}>
                    <span>Tổng tiền: </span>
                    <span style={{ fontWeight: 600 }}>
                        {formatPrice(totalPrice)}
                    </span>
                </div>
                <div className={cx("cart-right-last-line")}></div>
                <Button
                    primary
                    width="100%"
                    large
                    onClick={() => {
                        // Chuyển sang trang hoàn tất đặt hàng hoặc trang khác tùy bạn
                        alert("Đặt hàng thành công!");
                    }}
                    disabled={filteredCart.length === 0}
                >
                    Đặt hàng
                </Button>
            </div>
        </div>
    );
};

export default CartStep3;
