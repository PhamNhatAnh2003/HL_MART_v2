import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hàm hiển thị thông báo
const showToast = (message, type = "success") => {
    toast[type](message, {
        position: "top-center",
        autoClose: 3000, // 3 giây tự tắt
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
};

export default showToast;
