import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import CartStep from "../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import CartItem from "../Components/CartItem/CartItem";
import Button from "~/components/Button";
import { useNavigate } from "react-router-dom";
import config from "~/config";
import { useEffect } from "react";

const cx = classNames.bind(styles);

const Cart = () => {
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        refreshCart(); // Tự động gọi API khi vào trang giỏ hàng
    }, []); // Chạy 1 lần khi component mount

    // Lấy danh sách sản phẩm trong giỏ
    const cartItems = cart || [];

    // Kiểm tra nếu cartItems không phải mảng hoặc rỗng
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return (
            <div className={cx("cart-page")}>Vui lòng thêm hàng vào giỏ</div>
        );
    }

    // Tính tổng số sản phẩm, tổng số lượng và tổng tiền
    const totalProducts = cartItems.length;
    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={1} />
                <div className={cx("cart-content")}>
                    <div className={cx("cart-list-header")}>
                        <span>Ảnh đại diện</span>
                        <span>Tên sản phẩm</span>
                        <span>Thông tin</span>
                        <span>Số lượng</span>
                        <span>Tổng tiền</span>
                        <span>Xóa</span>
                    </div>
                    {cartItems.map((item, index) => (
                        <CartItem key={`cart-item-${index}`} item={item} />
                    ))}
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
                <Button onClick={() => navigate(config.routes.user.cartStep2)}>
                    Đặt hàng
                </Button>
            </div>
        </div>
    );
};

export default Cart;
