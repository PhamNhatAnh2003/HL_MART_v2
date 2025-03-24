import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./CartItem.module.scss";
import { formatPrice } from "~/utils/format";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    if (!item || !item.product) return null; // Nếu không có dữ liệu, không hiển thị

    const { id, quantity, product } = item; // Lấy thông tin sản phẩm
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const handleChangeQuantity = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setCurrentQuantity(newQuantity);
        onUpdateQuantity(id, newQuantity);
    };

    return (
        <div className={styles.cartItem}>
            <img
                src={product.image}
                alt={product.name}
                className={styles.image}
            />
            <span className={styles.name}>{product.name}</span>
            <span className={styles.unit}>{product.unit}</span>
            <span className={styles.price}>
                {formatPrice(product.price)}
            </span>
            <input
                type="number"
                value={currentQuantity}
                min="1"
                className={styles.quantity}
                onChange={handleChangeQuantity}
            />
            <FaTrash
                className={styles.deleteIcon}
                onClick={() => onRemove(id)}
            />
        </div>
    );
};

export default CartItem;
