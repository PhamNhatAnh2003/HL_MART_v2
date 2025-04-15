import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Cart2.module.scss";
import { useCart } from "~/hooks/useCart";

const cx = classNames.bind(styles);

const Cart2 = ({ isOpen, onClose }) => {
    // const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
     const { cart, refreshCart, totalProducts, totalQuantity, totalPrice } =
            useCart();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/cart");
            setCart(response.data.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            await axios.put("/api/cart/quantity", {
                cart_item_id: itemId,
                quantity: newQuantity,
            });
            fetchCart();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Có lỗi xảy ra khi cập nhật số lượng"
            );
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            await axios.delete("/api/cart/item", {
                data: { cart_item_id: itemId },
            });
            fetchCart();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Có lỗi xảy ra khi xóa sản phẩm"
            );
        }
    };

    const handleSelectItem = (itemId) => {
        const newSelected = new Set(selectedItems);
        newSelected.has(itemId)
            ? newSelected.delete(itemId)
            : newSelected.add(itemId);
        setSelectedItems(newSelected);
        setSelectAll(newSelected.size === cart?.items?.length);
    };

    const handleSelectAll = () => {
        const allSelected = !selectAll;
        setSelectAll(allSelected);
        setSelectedItems(
            allSelected
                ? new Set(cart?.items?.map((item) => item.cart_item_id))
                : new Set()
        );
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items
            .filter((item) => selectedItems.has(item.cart_item_id))
            .reduce((sum, item) => sum + item.subtotal, 0);
    };

    return (
        <div className={cx("drawer-wrapper", { open: isOpen })}>
            <div className={cx("backdrop")} onClick={onClose}></div>

            <div className={cx("drawer")}>
                <div className={cx("drawer-header")}>
                    <h2>Giỏ hàng</h2>
                    <button onClick={onClose}>
                        <XMarkIcon className={cx("icon")} />
                    </button>
                </div>

                <div className={cx("drawer-content")}>
                    {loading ? (
                        <div className={cx("spinner")} />
                    ) : !cart?.items?.length ? (
                        <div className={cx("empty-cart")}>
                            <p>Giỏ hàng trống</p>
                            <button onClick={onClose}>Tiếp tục mua sắm</button>
                        </div>
                    ) : (
                        <>
                            <div className={cx("cart-items")}>
                                <div className={cx("select-all")}>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                    <span>
                                        Chọn tất cả ({cart.items.length} sản
                                        phẩm)
                                    </span>
                                </div>

                                {cart.items.map((item) => (
                                    <div
                                        key={item.cart_item_id}
                                        className={cx("cart-item")}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(
                                                item.cart_item_id
                                            )}
                                            onChange={() =>
                                                handleSelectItem(
                                                    item.cart_item_id
                                                )
                                            }
                                        />

                                        <div className={cx("image-wrapper")}>
                                            <img
                                                src={item.image_url}
                                                alt={item.product_name}
                                            />
                                        </div>

                                        <div className={cx("item-info")}>
                                            <h3>{item.product_name}</h3>
                                            <p>
                                                {item.color_name} - {item.size}
                                            </p>
                                            <p className={cx("price")}>
                                                {item.unit_price.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </p>

                                            <div className={cx("actions")}>
                                                <div className={cx("quantity")}>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.cart_item_id,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <= 1
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.cart_item_id,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock_quantity
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className={cx("remove")}
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.cart_item_id
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={cx("checkout")}>
                                <div className={cx("total")}>
                                    <span>Tổng tiền:</span>
                                    <span>
                                        {calculateTotal().toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        if (selectedItems.size > 0) {
                                            window.location.href = `/checkout?items=${Array.from(
                                                selectedItems
                                            ).join(",")}`;
                                        }
                                    }}
                                    className={cx("checkout-btn", {
                                        disabled: selectedItems.size === 0,
                                    })}
                                    disabled={selectedItems.size === 0}
                                >
                                    Thanh toán ({selectedItems.size} sản phẩm)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart2;