import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './HeaderAdmin.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { useContext } from 'react';
import { Link } from "react-router-dom";
import config from "~/config";
import { useLocation } from "react-router-dom";
import SidebarAdmin from '../../../../Pages/admin/SidebarAdmin';


const cx = classNames.bind(styles);

export default function HeaderAdmin() {
    const { admin, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

return (
    <div className={cx("header")}>
        {/* <div className={cx("logoText")}>HL_MART</div> */}
        <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={cx("logoText")} onClick={() => setSidebarOpen(true)}>
            <span>HL_MART</span>
        </div>

        {admin && (
            <div className={cx("user-hugs")} ref={menuRef}>
                <img
                    className={cx("avatar-header")}
                    src={images.avatarUser}
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
                                navigate("/adminInfor");
                            }}
                        >
                            Admin
                        </div>
                        <div
                            className={cx("menu-item")}
                            onClick={() => {
                                handleLogout();
                                navigate("/");
                            }}
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
);
}
