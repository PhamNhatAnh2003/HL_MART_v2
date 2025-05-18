import React, { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./HeaderUser.module.scss";
import images from "~/assets/images";
import Search from "~/components/Search";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
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

    // Thêm state lưu gợi ý sản phẩm
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const location = useLocation();

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            // Đóng dropdown gợi ý khi click ngoài input và dropdown
            if (
                e.target.id !== "search-input" &&
                e.target.className !== cx("suggestion-item")
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Hàm giả lập gọi API gợi ý sản phẩm (thay bằng API thực tế của bạn)
    const fetchSuggestions = async (keyword) => {
        if (!keyword) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `/api/products/suggestions?keyword=${encodeURIComponent(
                    keyword
                )}`
            );
            if (!response.ok) throw new Error("Failed to fetch suggestions");

            const data = await response.json();
            console.log(data)
            setSuggestions(data);
        } catch (error) {
            console.error("Lấy gợi ý thất bại:", error);
            setSuggestions([]);
        }
    };

    // Khi searchValue thay đổi, gọi fetch gợi ý
    useEffect(() => {
        if (searchValue.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        fetchSuggestions(searchValue);
        setShowSuggestions(true);
    }, [searchValue]);

    const searchProducts = (event) => {
        if (event.key === "Enter" && searchValue.trim() !== "") {
            navigate(
                `${config.routes.user.productList}?name=${encodeURIComponent(
                    searchValue.trim()
                )}`
            );
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);
        navigate(
            `${config.routes.user.productList}?name=${encodeURIComponent(
                suggestion
            )}`
        );
        setShowSuggestions(false);
    };

    return (
        <div className={cx("header")}>
            <Link to={config.routes.user.home} className={cx("logoText")}>
                HL_Mart
            </Link>
            <div className={cx("tab-menu")} style={{ position: "relative" }}>
                <Search
                    id="search-input"
                    value={searchValue}
                    setValue={setSearchValue}
                    placeholder="Tìm kiếm sản phẩm..."
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={searchProducts}
                />

                {/* Dropdown gợi ý */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className={cx("suggestions-list")}>
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                className={cx("suggestion-item")}
                                onClick={() => handleSuggestionClick(item)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        handleSuggestionClick(item);
                                }}
                            >
                                <FaSearch className={cx("suggestion-icon")} />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {user && (
                <div className={cx("user-hugs")} ref={menuRef}>
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
                        src={user.avatar ?? images.avatarUser}
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
