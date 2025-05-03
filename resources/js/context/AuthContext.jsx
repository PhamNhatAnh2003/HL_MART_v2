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
    const [admin, setAdmin] = useState(null); // <<< Thêm admin state mới

  const fetchUser = async () => {
      try {
          // Gửi request để lấy thông tin người dùng và địa chỉ mặc định
          const response = await axios.get(`/api/user?id=${userId}`);
          const fetchedUser = response.data.user;
          const defaultAddress = response.data.default_address; // Lấy địa chỉ mặc định từ API

          // Cập nhật state với dữ liệu người dùng và địa chỉ mặc định
          setUser({ ...fetchedUser, default_address: defaultAddress });
          setCurrentUser(fetchedUser);

          // Nếu user có role là admin, setAdmin luôn
          if (role === "admin") {
              setAdmin(fetchedUser);
          } else {
              setAdmin(null);
          }
      } catch (error) {
          console.error("Error fetching user:", error);
      }
  };

    useEffect(() => {
        if (userId) {
            fetchUser();
        } else {
            setUser({});
            setCurrentUser({});
            setAdmin(null);
        }
    }, [userId, role]); 

    const updateUser = async () => {
        const formData = new FormData();
        Object.entries(currentUser).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === "phone") {
                    formData.append("phone", `${headPhone}${value}`);
                } else if (key === "desired_distance") {
                    formData.append(key, parseInt(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        try {
            const response = await axios.post(
                `/api/user/${currentUser.id}`,
                formData
            );

            if (response.status === 200) {
                showToast(response.data.message);
                fetchUser();
            }
        } catch (error) {
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

        // Nếu role là admin thì sau khi login sẽ fetch lại user và setAdmin
        if (userRole === "admin") {
            fetchUser();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setRole("");
        setUserId("");
        setAdmin(null);
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
                admin, 
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
