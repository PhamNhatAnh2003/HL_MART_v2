import React, { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./HeaderUser.module.scss";
import images from "~/assets/images";
import Search from "~/components/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import {
    faChevronDown,
    faChevronUp,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "~/config";
import { AuthContext } from "~/context/AuthContext";
import { useLocation } from "react-router-dom";
import Cart2 from "../../../../Pages/user/Cart2";

const cx = classNames.bind(styles);

export default function HeaderUser() {
    const { user, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const [searchValue, setSearchValue] = useState("");
     const [isCartOpen, setIsCartOpen] = useState(false);

    const location = useLocation();

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const searchProducts = (event) => {
        if (event.key === "Enter" && searchValue.trim() !== "") {
            navigate(
                `${config.routes.user.productList}?name=${encodeURIComponent(
                    searchValue.trim()
                )}`
            );
        }
    };

    return (
        <div className={cx("header")}>
            <Link to={config.routes.user.home} className={cx("logoText")}>
                HL_Mart
            </Link>
            <div className={cx("tab-menu")}>
                <Search
                    value={searchValue}
                    setValue={setSearchValue}
                    placeholder="Tìm kiếm sản phẩm..."
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={searchProducts}
                />
            </div>
            {user && (
                <div className={cx("user-hugs")} ref={menuRef}>
                    {/* <div className={cx("shoppingcart-header")}>
                        <Link to={config.routes.user.cart}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span>Giỏ Hàng</span>
                        </Link>
                    </div> */}
                    <Cart2
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />

                    <div
                        className={cx("shoppingcart-header")}
                        onClick={() => setIsCartOpen(true)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <span>Giỏ Hàng</span>
                    </div>

                    <img
                        className={cx("avatar-header")}
                        src={user.avatar ?? images.login}
                        alt="avatar"
                        onClick={() => setShowMenu((prev) => !prev)}
                    />
                    <FontAwesomeIcon
                        icon={showMenu ? faChevronUp : faChevronDown}
                        onClick={() => setShowMenu((prev) => !prev)}
                    />
                    {showMenu && (
                        <div className={cx("dropdown-menu")}>
                            <div
                                className={cx("menu-item")}
                                onClick={() => {
                                    navigate("/userInfor");
                                }}
                            >
                                Thông tin cá nhân
                            </div>
                            <div
                                className={cx("menu-item")}
                                onClick={() => {
                                    handleLogout();
                                    navigate("/login");
                                }}
                            >
                                Đăng xuất
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
