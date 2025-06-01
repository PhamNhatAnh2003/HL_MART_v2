import React from "react";
import { FaMotorcycle, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./Banner.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Banner = () => {
    return (
        <div className={cx('banner')}>
            {/* Item 1 */}
            <div className={cx('item')}>
                <FaMotorcycle size={40} color="#ff5c5c" />
                <p className={cx('title')}>Miễn phí giao hàng</p>
            </div>

            {/* Item 2 */}
            <div className={cx('item')}>
                <FaClock size={40} color="#ff5c5c" />
                <p className={cx('title')}>Giao hàng nhanh</p>
            </div>

            {/* Item 3 */}
            <div className={cx('item')}>
                <FaMapMarkerAlt size={40} color="#ff5c5c" />
                <p className={cx('title')}>Các tỉnh thành</p>
            </div>
        </div>
    );
};

export default Banner;
