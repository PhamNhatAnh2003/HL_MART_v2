import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './HeaderAdmin.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { useContext } from 'react';
const cx = classNames.bind(styles);

export default function HeaderAdmin() {
    const { handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

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
        <div className={cx('header')}>
            <h1 className={styles.logoText}>SunRise</h1>
            <div className={cx('user-hugs')} ref={menuRef}>
                <img
                    className={cx('avatar-header')}
                    src={images.avatarUser}
                    alt="avatar"
                    onClick={() => setShowMenu((prev) => !prev)}
                />
                <FontAwesomeIcon
                    icon={showMenu ? faChevronUp : faChevronDown}
                    onClick={() => setShowMenu((prev) => !prev)}
                />
                {showMenu && (
                    <div className={cx('dropdown-menu')}>
                        <div
                            className={cx('menu-item')}
                            onClick={() => {
                                navigate('/userInfor');
                            }}
                        >
                            UserInfor
                        </div>
                        <div
                            className={cx('menu-item')}
                            onClick={() => {
                                handleLogout();
                                navigate('/login');
                            }}
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
