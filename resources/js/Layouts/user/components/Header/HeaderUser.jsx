import React, { useState, useRef, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './HeaderUser.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from '~/config';
import { AuthContext } from '~/context/AuthContext';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

export default function HeaderUser() {
    const { user, handleLogout } = useContext(AuthContext);
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={cx('header')}>
            <Link to={config.routes.user.home} className={styles.logoText}>
                SunRise
            </Link>
            <div className={cx('tab-menu')}>
                <Link
                    to={config.routes.user.home}
                    className={cx('tab-item', { active: location.pathname === config.routes.user.home })}
                >
                    ホーム
                </Link>
                <Link
                    to={config.routes.user.findRestaurant}
                    className={cx('tab-item', { active: location.pathname === config.routes.user.findRestaurant })}
                >
                    レストラン
                </Link>
                <Link
                    to={config.routes.user.map}
                    className={cx('tab-item', { active: location.pathname === config.routes.user.map })}
                >
                    地図
                </Link>
            </div>
            {user && (
                <div className={cx('user-hugs')} ref={menuRef}>
                    <div className={cx('favorite-header')}>
                        <Link to={config.routes.user.favorite}>
                            <FontAwesomeIcon icon={faHeart} />
                            <span>お気に入り</span>
                        </Link>
                    </div>
                    <img
                        className={cx('avatar-header')}
                        src={user.avatar ?? images.avatarUser}
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
                                プロフィール
                            </div>
                            <div
                                className={cx('menu-item')}
                                onClick={() => {
                                    handleLogout();
                                    navigate('/login');
                                }}
                            >
                                ログアウト
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
