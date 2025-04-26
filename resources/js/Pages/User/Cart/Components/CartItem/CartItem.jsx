import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./CartItem.module.scss";
import { formatPrice } from "~/utils/format";
import { useCart } from "~/hooks/useCart";
import classNames from "classnames/bind";
import images from "~/assets/images";
const cx = classNames.bind(styles);

const CartItem = ({ item, index }) => {
    if (!item) return null;

    const {
        product_name,
        avatar,
        unit,
        quantity,
        price,
        discount_price,
        subtotal,
    } = item;

    // Ưu tiên dùng discount_price nếu có, không thì fallback về price_at_time
    const finalPrice = discount_price && parseFloat(discount_price) > 0
        ? discount_price
        : price;

    return (
        <div className={cx("container")}>
            <div className={cx("columnSTT")}>{index}</div>
            <div className={cx("columnImage")}>
                <img
                    className={cx("image")}
                    src={avatar ||"/default-avatar.jpg"}
                    alt={product_name}
                />
            </div>
            <div className={cx("columnName")}>{product_name}</div>
            <div className={cx("columnUnit")}>{unit}</div>
            <div className={cx("columnPrice")}>
                {formatPrice(finalPrice)}
            </div>
            <div className={cx("columnQuantity")}>
                <span className={cx("readonlyQuantity")}>{quantity}</span>
            </div>
        </div>
    );
};

export default CartItem;
