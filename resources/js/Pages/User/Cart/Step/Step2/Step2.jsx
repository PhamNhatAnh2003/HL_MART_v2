import classNames from "classnames/bind";
import styles from "./Step2.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import config from "~/config";
import useProfile from "~/hooks/useProfile";
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext";

const cx = classNames.bind(styles);

const Step2 = () => {
    const { profile: loginedProfile } = useContext(AuthContext);
    const { profile, setProfile } = useProfile();

    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy danh sách ID sản phẩm được chọn từ query
    const queryParams = new URLSearchParams(location.search);
    const itemIds = queryParams.get("items")?.split(",") || [];

    // Lọc giỏ hàng để chỉ lấy sản phẩm được chọn
    const selectedCart =
        cart?.filter((item) => itemIds.includes(item.product.id.toString())) ||
        [];

    // Tính tổng
    const totalProducts = selectedCart.length;
    const totalQuantity = selectedCart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );
    const totalPrice = selectedCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    useEffect(() => {
        if (loginedProfile) {
            setProfile(loginedProfile);
        }
    }, [loginedProfile, setProfile]);

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={2} />
                <div className={cx("cart-content")}>
                    <div className={cx("title")}>Thông tin người nhận hàng</div>

                    <div className={cx("two-items")}>
                        <div>
                            <span className={cx("label")}>Người nhận: </span>
                            <span>
                                {profile.first_name || "Chưa có thông tin"}
                            </span>
                        </div>
                        <div>
                            <span className={cx("label")}>Email: </span>
                            <span>{profile.Email || "Chưa có thông tin"}</span>
                        </div>
                    </div>

                    <div className={cx("two-items")}>
                        <div>
                            <span className={cx("label")}>Số điện thoại: </span>
                            <span>{profile.phone || "Chưa có thông tin"}</span>
                        </div>
                        <div>
                            <span className={cx("label")}>Địa chỉ: </span>
                            <span>
                                {profile.address || "Chưa có thông tin"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx("cart-right")}>
                <h2>Tổng tiền giỏ hàng</h2>
                {selectedCart.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    <p>Không có sản phẩm nào được chọn.</p>
                )}
                <div className={cx("cart-right-last-line")}></div>
                <Button
                    primary
                    width="100%"
                    large
                    onClick={() => {
                        const itemsQuery = itemIds.join(",");
                        navigate(
                            `${config.routes.user.step3}?items=${itemsQuery}`
                        );
                    }}
                    disabled={selectedCart.length === 0}
                >
                    Thanh Toán
                </Button>
            </div>
        </div>
    );
};

export default Step2;
