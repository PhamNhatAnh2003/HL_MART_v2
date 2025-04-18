import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames/bind";
import styles from "./Cart2.module.scss";
import { useCart } from "~/hooks/useCart";
import Button from "~/components/Button";
import CartItem2 from "./components/CartItem2";
import { formatPrice } from "~/utils/format";
import images from "~/assets/images";
import { useNavigate } from "react-router-dom";
import config from "~/config";


const cx = classNames.bind(styles);

const Cart2 = ({ isOpen, onClose }) => {
const {
    cart: rawCart,
    loading,
    refreshCart,
    TotalPrice2,
} = useCart();
const navigate = useNavigate();


const cart = Array.isArray(rawCart) ? rawCart : [];

    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (isOpen) {
            refreshCart();
        }
    }, [isOpen]);

useEffect(() => {
    const newSelected = new Set(
        selectAll ? cart.map((item) => item.product.id) : []
    );

    // Chỉ setState nếu newSelected khác hiện tại
    const isDifferent =
        selectedItems.size !== newSelected.size ||
        [...newSelected].some((id) => !selectedItems.has(id));

    if (isDifferent) {
        setSelectedItems(newSelected);
    }
}, [selectAll, cart]);

    const handleSelectItem = (productId) => {
        const newSelected = new Set(selectedItems);
        newSelected.has(productId)
            ? newSelected.delete(productId)
            : newSelected.add(productId);
        setSelectedItems(newSelected);
        setSelectAll(newSelected.size === cart.length);
    };


    return (
        <div className={cx("drawer-wrapper", { open: isOpen })}>
            <div className={cx("backdrop")} onClick={onClose}></div>

            <div className={cx("drawer")}>
                <div className={cx("drawer-header")}>
                    <h2>Giỏ hàng</h2>
                    <Button primary onClick={onClose}>
                        <XMarkIcon className={cx("icon")} />
                    </Button>
                </div>

                <div className={cx("drawer-content")}>
                    {loading ? (
                        <div className={cx("spinner")} />
                    ) : !cart.length ? (
                        <div className={cx("cart-empty")}>
                            <img src={images.emptycart} alt="Giỏ hàng trống" />
                            <p>Giỏ hàng chưa có sản phẩm</p>
                            <Button
                                className={cx("back-home")}
                                onClick={onClose}
                            >
                                Quay lại
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className={cx("cart-items")}>
                                <div className={cx("select-all")}>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={() =>
                                            setSelectAll(!selectAll)
                                        }
                                    />
                                    <span>
                                        Chọn tất cả ({cart.length} sản phẩm)
                                    </span>
                                </div>

                                {cart.map((item) => (
                                    <CartItem2
                                        key={item.product.id}
                                        item={item}
                                        selectedItems={selectedItems}
                                        handleSelectItem={handleSelectItem}
                                    />
                                ))}
                            </div>

                            <div className={cx("checkout")}>
                                <div className={cx("total")}>
                                    <span>Tổng tiền:</span>
                                    <span>
                                        {formatPrice(
                                            TotalPrice2(cart, selectedItems)
                                        )}
                                    </span>
                                </div>

                                <Button
                                    onClick={() => {
                                        if (selectedItems.size > 0) {
                                            const ids =
                                                Array.from(selectedItems).join(
                                                    ","
                                                );
                                                onClose();
                                            navigate(
                                                `${
                                                    config.routes.user.step2
                                                }?items=${Array.from(
                                                    selectedItems
                                                ).join(",")}`
                                            );

                                        }
                                    }}
                                    className={cx("checkout-btn")}
                                    disabled={selectedItems.size === 0}
                                >
                                    Thanh toán ({selectedItems.size} sản phẩm)
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart2;
