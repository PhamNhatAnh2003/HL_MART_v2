import classNames from "classnames/bind";
import styles from "./Step2.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import CartItem from "../../Components/CartItem/CartItem";
import Button from "~/components/Button";
import { useNavigate } from "react-router-dom"; // Điều hướng
import config from "~/config";
import { Input } from "~/components/Input";
import useProfile from "~/hooks/useProfile";
import Dropdown from "~/components/Dropdown";
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext";

const cx = classNames.bind(styles);

const Step2 = () => {
    const { profile: loginedProfile } = useContext(AuthContext);
    const { profile, setProfileField, setProfile } = useProfile();
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate(); // Khai báo navigate để điều hướng

    useEffect(() => {
        if (loginedProfile) {
            setProfile(loginedProfile);
        }
    }, [loginedProfile]);

    useEffect(() => {
        refreshCart(); // Tự động gọi API khi vào trang giỏ hàng
    }, []); // Chạy 1 lần khi component mount

    // Lấy danh sách sản phẩm trong giỏ
    const cartItems = cart || [];

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


        const handleInputChange = (field, value) => {
            setProfileField(field, value); // Thay vì setValue
        };

    // Hàm lưu thông tin và chuyển sang bước 3
    const handleProceedToStep3 = () => {
        // Lưu thông tin người nhận (nếu cần thiết, có thể thêm logic kiểm tra dữ liệu trước khi lưu)
        if (
            !profile.first_name ||
            !profile.last_name ||
            !profile.phone ||
            !profile.gender
        ) {
            alert("Vui lòng điền đầy đủ thông tin người nhận!");
            return;
        }

        // Điều hướng sang trang bước 3
        navigate(config.routes.user.cartStep3);
    };

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={2} />
                <div className={cx("cart-content")}>
                    <div className={cx("title")}>Thông tin người nhận hàng</div>

                    <div className={cx("two-items")}>
                        <Input
                            value={profile.first_name || ""}
                            setValue={(value) =>
                                handleInputChange("first_name", value)
                            }
                            label="Họ"
                            placeholder="Nhập họ"
                            required
                        />
                        <Input
                            value={profile.last_name || ""}
                            setValue={(value) =>
                                handleInputChange("last_name", value)
                            }
                            label="Tên"
                            placeholder="Nhập tên"
                            required
                        />
                    </div>

                    <div className={cx("two-items")}>
                        <Input
                            value={profile.phone || ""}
                            setValue={(value) =>
                                handleInputChange("phone", value)
                            }
                            label="Số điện thoại"
                            placeholder="Nhập số điện thoại"
                            required
                        />
                        <Dropdown
                            title="Chọn giới tính"
                            label="Giới tính"
                            selected={profile.gender || ""}
                            setValue={(value) =>
                                handleInputChange("gender", value)
                            } // Sử dụng setProfileField cho Dropdown
                            required
                        >
                            <Button
                                width="100%"
                                noRadius
                                onClick={() =>
                                    handleInputChange("gender", "Nam")
                                }
                            >
                                Nam
                            </Button>
                            <Button
                                width="100%"
                                noRadius
                                onClick={() =>
                                    handleInputChange("gender", "Nữ")
                                }
                            >
                                Nữ
                            </Button>
                            <Button
                                width="100%"
                                noRadius
                                onClick={() =>
                                    handleInputChange("gender", "Khác")
                                }
                            >
                                Khác
                            </Button>
                        </Dropdown>
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
