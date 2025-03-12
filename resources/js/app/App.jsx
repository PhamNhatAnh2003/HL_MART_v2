import "antd/dist/reset.css"; 
import Login from "../Pages/Others/Login";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home"; // Thêm trang chính

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;

