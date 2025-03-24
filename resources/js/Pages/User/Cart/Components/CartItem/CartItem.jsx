import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./CartItem.module.scss";
import { formatPrice } from "~/utils/format";

const CartItem = ({ item, onUpdateQuantity, onRemove, index }) => {
    if (!item || !item.product) return null; // Nếu không có dữ liệu, không hiển thị

    const { id, quantity, product } = item; // Lấy thông tin sản phẩm
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const handleChangeQuantity = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setCurrentQuantity(newQuantity);
        onUpdateQuantity(id, newQuantity);
    };

    return (
        <div className={styles.container}>
            <div className={styles.columnSTT}>{index}</div>
            <div className={styles.columnImage}>
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                />
            </div>
            <div className={styles.columnName}>{product.name}</div>
            <div className={styles.columnUnit}>{product.unit}</div>
            <div className={styles.columnPrice}>
                {formatPrice(product.price)}
            </div>
            <div className={styles.columnQuantity}>
                <input
                    type="number"
                    value={currentQuantity}
                    min="1"
                    className={styles.quantity}
                    onChange={handleChangeQuantity}
                />
            </div>
            <div className={styles.columnDelete}>
                <FaTrash
                    className={styles.deleteIcon}
                    onClick={() => onRemove(id)}
                />
            </div>
        </div>
    );
};

export default CartItem;
