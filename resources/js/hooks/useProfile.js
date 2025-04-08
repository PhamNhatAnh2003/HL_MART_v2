import { useState, useEffect, useContext } from "react";
import { AuthContext } from "~/context/AuthContext";

const useProfile = () => {
    // Lấy thông tin người dùng và các hàm từ AuthContext
    const { currentUser, setCurrentUser, headPhone, setHeadPhone, updateUser } =
        useContext(AuthContext);

    // Khởi tạo state cho profile nếu chưa có thông tin từ currentUser
    const [profile, setProfile] = useState({
        first_name: currentUser.name || "",
        Email: currentUser.email || "",
        phone: currentUser.phone || "",
        // gender: currentUser.gender || "",
        address: currentUser.address || "",
        avatar: currentUser.avatar || "",
        user_id: currentUser.id || "",
    });

    // Cập nhật profile khi currentUser thay đổi
    useEffect(() => {
        if (currentUser) {
            setProfile({
                first_name: currentUser.name || "",
                Email: currentUser.email || "",
                phone: currentUser.phone || "",
                // gender: currentUser.gender || "",
                address: currentUser.address || "",
                avatar: currentUser.avatar || "",
                user_id: currentUser.id || "",
            });
        }
    }, [currentUser]);

    // Hàm cập nhật trường dữ liệu profile
    const setProfileField = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    // Hàm lưu thông tin cập nhật cho người dùng
    const saveProfile = async () => {
        try {
            await updateUser(); // Cập nhật thông tin người dùng
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return {
        profile,
        setProfileField,
        setProfile,
        saveProfile,
        setHeadPhone, // Cung cấp hàm cập nhật mã vùng điện thoại nếu cần
        headPhone, // Cung cấp mã vùng hiện tại
    };
};

export default useProfile;
