import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./CartItem2.module.scss";
import { formatPrice } from "~/utils/format";
import { useCart } from "~/hooks/useCart";

const cx = classNames.bind(styles);

const CartItem2 = ({ item, selectedItems, handleSelectItem }) => {
    const { quantity, product } = item;
    const { updateQuantity, removeFromCart } = useCart();
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const handleChangeQuantity = (e) => {
        let newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setCurrentQuantity(newQuantity);
        updateQuantity(product.id, newQuantity);
    };

    return (
        <div className={cx("cart-item")}>
            <input
                type="checkbox"
                checked={selectedItems.has(product.id)}
                onChange={() => handleSelectItem(product.id)}
            />

            <div className={cx("image-wrapper")}>
                <img
                    src={product.image_url}
                    alt={product.name}
                    className={cx("image")}
                />
            </div>

            <div className={cx("item-info")}>
                <h3>{product.name}</h3>
                <p className={cx("price")}>{formatPrice(product.price)} đ</p>

                <div className={cx("actions")}>
                    <div className={cx("quantity")}>
                        <input
                            type="number"
                            value={currentQuantity}
                            min="1"
                            onChange={handleChangeQuantity}
                            className={cx("quantity-input")}
                        />
                    </div>

                    <button
                        className={cx("remove")}
                        onClick={() => removeFromCart(product.id)}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem2;
