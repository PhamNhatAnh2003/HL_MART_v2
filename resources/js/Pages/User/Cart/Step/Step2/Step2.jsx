import classNames from "classnames/bind";
import styles from "./Step2.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";
import { useNavigate } from "react-router-dom"; // Điều hướng
import config from "~/config";
import useProfile from "~/hooks/useProfile";
import Dropdown from "~/components/Dropdown";
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext"; // Import context

const cx = classNames.bind(styles);

const Step2 = () => {
    const { profile: loginedProfile } = useContext(AuthContext); // Lấy profile từ AuthContext
    const { profile, setProfile } = useProfile(); // Hook để lấy và set profile

    const { cart, totalProducts, totalQuantity, totalPrice } = useCart();
    const navigate = useNavigate(); // Khai báo navigate để điều hướng

    // Kiểm tra và cập nhật thông tin người dùng vào profile khi đăng nhập
    useEffect(() => {
        if (loginedProfile) {
            setProfile(loginedProfile); // Nếu đã có thông tin người dùng trong AuthContext, set vào profile
        }
    }, [loginedProfile, setProfile]); // Chạy lại khi loginedProfile thay đổi

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={2} />
                <div className={cx("cart-content")}>
                    <div className={cx("title")}>Thông tin người nhận hàng</div>

                    {/* Hiển thị thông tin người dùng đã đăng nhập */}
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
                {cart ? (
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
                    <p>Đang tải thông tin giỏ hàng...</p>
                )}
                <div className={cx("cart-right-last-line")}></div>
                <Button
                    primary
                    width="100%"
                    large
                    onClick={() => navigate(config.routes.user.step3)} // Khi nhấn nút sẽ gọi hàm handleProceedToStep3
                >
                    Thanh Toán
                </Button>
            </div>
        </div>
    );
};

export default Step2;
