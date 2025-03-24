import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./CartItem.module.scss";
import { formatPrice } from "~/utils/format";
import { useCart } from "~/hooks/useCart";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CartItem = ({ item, index }) => {
    if (!item || !item.product) return null; // Nếu không có dữ liệu, không hiển thị
    const { cart } = useCart();
    const { quantity, product } = item; // Lấy thông tin sản phẩm
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const { updateQuantity, removeFromCart } = useCart(); // Lấy hàm từ CartContext


    useEffect(() => {
        setCurrentQuantity(quantity);
    }, [cart, quantity]);

    const handleChangeQuantity = (e) => {
        let newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setCurrentQuantity(newQuantity);
        updateQuantity(product.id, newQuantity);
    };

    return (
        <div className={cx("container")}>
            <div className={cx("columnSTT")}>{index}</div>
            <div className={cx("columnImage")}>
                <img
                    className={cx("image")}
                    src={product.image}
                    alt={product.name}
                />
            </div>
            <div className={cx("columnName")}>{product.name}</div>
            <div className={cx("columnUnit")}>{product.unit}</div>
            <div className={cx("columnPrice")}>
                {formatPrice(product.price)}
            </div>
            <div className={cx("columnQuantity")}>
                <input
                    type="number"
                    value={currentQuantity}
                    min="1"
                    className={cx("quantity")}
                    onChange={handleChangeQuantity}
                />
            </div>
            <div className={cx("delete-btn-con")}>
                <FaTrash
                    className={cx("delete-btn")}
                    onClick={() => removeFromCart(product.id)}
                />
            </div>
        </div>
    );
};

export default CartItem;
