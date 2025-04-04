import axios from "axios";
import { createContext, useEffect, useState } from "react";
import showToast from "~/components/message";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [headPhone, setHeadPhone] = useState("+84");

    // console.log(user);
    // console.log(currentUser);

    const fetchUser = async () => {
        const resonse = await axios.get(`/api/user?id=${userId}`);
        setUser(resonse.data.user);
        setCurrentUser(resonse.data.user);
    };

    useEffect(() => {
        if (userId) {
            fetchUser();
        } else {
            setUser({});
            setCurrentUser({});
        }
    }, [userId]);

    const updateUser = async () => {
        const formData = new FormData();

        // Duyệt qua các thuộc tính của currentUser và thêm vào formData
        Object.entries(currentUser).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === "phone") {
                    // Ghép mã quốc gia với số điện thoại
                    formData.append("phone", `${headPhone}${value}`);
                } else if (key === "desired_distance") {
                    // Chỉ lưu giá trị số cho desired_distance
                    formData.append(key, parseInt(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        try {
            // Gửi yêu cầu POST tới API
            const response = await axios.post(
                `/api/user/${currentUser.id}`,
                formData
            );

            if (response.status === 200) {
                // Nếu cập nhật thành công, hiển thị thông báo và gọi fetchUser để lấy dữ liệu mới
                // console.log(response.data.user.phone);
                // console.log(currentUser);
                showToast(response.data.message);
                fetchUser(); // Gọi lại hàm để tải lại dữ liệu người dùng mới
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error updating user:", error);
        }
    };


    const handleLogin = (token, userRole, user_id) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userId", user_id);
        setIsAuthenticated(true);
        setRole(userRole);
        setUserId(user_id);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setRole("");
        setUserId("");
    };

    return (
        <AuthContext.Provider
            value={{
                headPhone,
                setHeadPhone,
                isAuthenticated,
                role,
                userId,
                user,
                currentUser,
                setUser,
                setCurrentUser,
                updateUser,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
