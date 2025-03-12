import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./CartItem.module.scss";

// Dữ liệu giả (Fake Data)
const fakeItem = {
    id: 1,
    image: "https://via.placeholder.com/50", // Ảnh giả
    name: "Thùng 24 lon nước tăng lực STING hương dâu 330ml/320ml",
    unit: "Thùng",
    price: 1000000,
    quantity: 10,
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    // Nếu `item` không có giá trị, sử dụng dữ liệu giả `fakeItem`
    const product = item || fakeItem;

    const [quantity, setQuantity] = useState(product.quantity);

    const handleChangeQuantity = (e) => {
        const newQuantity = parseInt(e.target.value, 10) || 1;
        setQuantity(newQuantity);
        onUpdateQuantity(product.id, newQuantity);
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
                {product.price.toLocaleString()}đ
            </span>
            <input
                type="number"
                value={quantity}
                min="1"
                className={styles.quantity}
                onChange={handleChangeQuantity}
            />
            <FaTrash
                className={styles.deleteIcon}
                onClick={() => onRemove(product.id)}
            />
        </div>
    );
};

export default CartItem;
