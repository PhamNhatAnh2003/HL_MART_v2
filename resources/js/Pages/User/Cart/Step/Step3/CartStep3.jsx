import classNames from "classnames/bind";
import styles from "./CartStep3.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import config from "~/config";
import useProfile from "~/hooks/useProfile";
import { useContext, useEffect, useMemo } from "react";
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
    const totalPrice = filteredCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    useEffect(() => {
        setProfile(loginedProfile);
    }, [loginedProfile]);

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={3} />
                <div className={cx("cart-content")}></div>
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
