import React, { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./HeaderStaff.module.scss";
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "~/config";
import { AuthContext } from "~/context/AuthContext";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

export default function HeaderStaff() {
    const { staff, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

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
    
    return (
        <div className={cx("header")}>
            <Link
                to={config.routes.staff.productManage}
                className={cx("logoText")}
            >
                HL_Mart
            </Link>
            <div className={cx("tab-menu")}>
                <Link
                    to={config.routes.staff.productManage}
                    className={cx("tab-item", {
                        active:
                            location.pathname ===
                            config.routes.staff.productManage,
                    })}
                >
                    Quản lý sản phẩm
                </Link>
                <Link
                    to={config.routes.staff.orderManage}
                    className={cx("tab-item", {
                        active:
                            location.pathname ===
                            config.routes.staff.orderManage,
                    })}
                >
                    Đơn hàng
                </Link>
                <Link
                    to={config.routes.staff.categoryManage}
                    className={cx("tab-item", {
                        active:
                            location.pathname ===
                            config.routes.staff.categoryManage,
                    })}
                >
                    Danh mục sản phẩm
                </Link>
            </div>
            {staff && (
                <div className={cx("user-hugs")} ref={menuRef}>
                    <img
                        className={cx("avatar-header")}
                        src={staff.avatar ?? images.avatarUser}
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
                                    navigate("/staff/profile");
                                    setShowMenu(false);
                                }}
                            >
                                Hồ sơ nhân viên
                            </div>
                            <div
                                className={cx("menu-item")}
                                onClick={() => {
                                    handleLogout();
                                    navigate("/login");
                                    setShowMenu(false);
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
