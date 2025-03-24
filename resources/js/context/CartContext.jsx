import { useAuth } from "~/hooks/useAuth";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import showToast from "~/components/message"

// 1️⃣ Tạo context giỏ hàng
const CartContext = createContext();

// 2️⃣ Provider để bọc toàn bộ ứng dụng
const CartProvider = ({ children }) => {
    const { user } = useAuth(); // 🔥 Lấy user từ AuthContext
    const [cart, setCart] = useState([]); // Trạng thái giỏ hàng
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

    // 3️⃣ Fetch giỏ hàng khi user thay đổi
    useEffect(() => {
        if (user?.id) {
            fetchCart();
        } else {
            setCart([]); // Nếu user logout, xóa giỏ hàng
        }
    }, [user?.id]);

    // 4️⃣ Hàm lấy giỏ hàng từ server
const fetchCart = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
        const response = await axios.get(`/api/cart/${user.id}`);

        if (response.data.success) {
            setCart(response.data.cart_items);
            console.log(response.data.cart_items); // Kiểm tra dữ liệu nhận được
        } else {
            console.error("Lỗi: Không thể lấy giỏ hàng");
        }
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
        setLoading(false);
    }
};

const refreshCart = async () => {
    await fetchCart(); // Gọi lại API để cập nhật giỏ hàng
};


    // 5️⃣ Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product) => {
        if (!user?.id) {
            alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
            return;
        }
       try {
           const response = await axios.post("/api/addtocart", {
               user_id: user.id,
               product_id: product.id,
               unit: product.unit,
               quantity: 1,
               price_at_time: product.price,
           });
            showToast(response.data.message);
            setCart(response.data);
       } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
       }
    };

    // 6️⃣ Cập nhật số lượng sản phẩm
    const updateQuantity = async (productId, quantity) => {
        if (!user?.id) return;
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        try {
            const response = await axios.put(`/api/cart/${productId}`, {
                user_id: user.id,
                quantity,
            });
            setCart(response.data);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    // 7️⃣ Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (productId) => {
        if (!user?.id) return;
        try {
            await axios.delete(`/api/cart/${productId}`, {
                data: { user_id: user.id },
            });
            setCart(cart.filter((item) => item.product_id !== productId));
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    // 8️⃣ Xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        if (!user?.id) return;
        try {
            await axios.delete("/api/cart/clear", {
                data: { user_id: user.id },
            });
            setCart([]);
        } catch (error) {
            console.error("Lỗi khi xóa giỏ hàng:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export {CartContext, CartProvider}
