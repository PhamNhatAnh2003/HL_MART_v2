// import { useAuth } from "./AuthProvider";
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// // 1️⃣ Tạo context giỏ hàng
// const CartContext = createContext();

// // 2️⃣ Tạo provider để bọc toàn bộ ứng dụng
// export const CartProvider = ({ children }) => {
//     const { user } = useAuth(); // 🔥 Lấy thông tin user từ AuthContext
//     const [cart, setCart] = useState([]); // Trạng thái lưu giỏ hàng

//     useEffect(() => {
//         if (user) {
//             fetchCart();
//         } else {
//             setCart([]); // Nếu không có user, xóa giỏ hàng
//         }
//     }, [user]); // 🔥 Khi user thay đổi, load lại giỏ hàng
    
//     // 3️⃣ Lấy giỏ hàng từ backend khi tải trang
//     useEffect(() => {
//         fetchCart();
//     }, []);

//     const fetchCart = async () => {
//         try {
//             const response = await axios.get("/api/cart"); // Gọi API lấy giỏ hàng từ backend Laravel
//             setCart(response.data);
//         } catch (error) {
//             console.error("Lỗi khi lấy giỏ hàng:", error);
//         }
//     };

//     // 4️⃣ Thêm sản phẩm vào giỏ
//     const addToCart = async (product) => {
//         try {
//             const response = await axios.post("/api/cart", {
//                 product_id: product.id,
//                 unit: product.unit,
//                 quantity: 1,
//                 price_at_time: product.price,
//             });
//             setCart(response.data);
//         } catch (error) {
//             console.error("Lỗi khi thêm sản phẩm:", error);
//         }
//     };

//     // 5️⃣ Cập nhật số lượng sản phẩm trong giỏ
//     const updateQuantity = async (productId, quantity) => {
//         try {
//             const response = await axios.put(`/api/cart/${productId}`, {
//                 quantity,
//             });
//             setCart(response.data);
//         } catch (error) {
//             console.error("Lỗi khi cập nhật số lượng:", error);
//         }
//     };

//     // 6️⃣ Xóa sản phẩm khỏi giỏ
//     const removeFromCart = async (productId) => {
//         try {
//             await axios.delete(`/api/cart/${productId}`);
//             setCart(cart.filter((item) => item.product_id !== productId));
//         } catch (error) {
//             console.error("Lỗi khi xóa sản phẩm:", error);
//         }
//     };

//     // 7️⃣ Xóa toàn bộ giỏ hàng
//     const clearCart = async () => {
//         try {
//             await axios.delete("/api/cart/clear");
//             setCart([]);
//         } catch (error) {
//             console.error("Lỗi khi xóa giỏ hàng:", error);
//         }
//     };

//     return (
//         <CartContext.Provider
//             value={{
//                 cart,
//                 addToCart,
//                 updateQuantity,
//                 removeFromCart,
//                 clearCart,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };


// export {CartContext, CartProvider};
