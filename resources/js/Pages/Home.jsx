import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate(); // Hook điều hướng

    return (
        <div>
            <h1>Trang chủ</h1>
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
    );
};

export default Home;
