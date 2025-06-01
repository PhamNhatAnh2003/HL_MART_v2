import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./CartItem2.module.scss";
import { formatPrice } from "~/utils/format";
import { useCart } from "~/hooks/useCart";
import images from "~/assets/images";
const cx = classNames.bind(styles);

const CartItem2 = ({ item, selectedItems, handleSelectItem }) => {
    const { quantity, product } = item;
    const { updateQuantity, removeFromCart } = useCart();
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    // const handleChangeQuantity = (e) => {
    //     let newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    //     setCurrentQuantity(newQuantity);
    //     updateQuantity(product.id, newQuantity);
    // };

    return (
        <div className={cx("cart-item")}>
            <input
                type="checkbox"
                checked={selectedItems.has(product.id)}
                onChange={() => handleSelectItem(product.id)}
            />

            <div className={cx("image-wrapper")}>
                <img
                    src={product.avatar}
                    alt={product.name}
                    className={cx("image")}
                />
            </div>

            <div className={cx("item-info")}>
                <h3>{product.name}</h3>
                <div className={cx("columnPrice")}>
                    <div className={cx("priceWrapper")}>
                        {product.discount_price &&
                        product.discount_price < product.price ? (
                            <>
                                <span className={cx("discount-price")}>
                                    {formatPrice(product.discount_price)}
                                </span>
                                <span className={cx("original-price")}>
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className={cx("normal-price")}>
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                <div className={cx("actions")}>
                    <div className={cx("quantity")}>
                        <input
                            type="number"
                            value={currentQuantity}
                            min="1"
                            onChange={(e) => setCurrentQuantity(e.target.value)}
                            onBlur={() =>
                                updateQuantity(product.id, currentQuantity)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateQuantity(product.id, currentQuantity);
                                }
                            }}
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
