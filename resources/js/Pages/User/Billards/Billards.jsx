import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Billards.scss";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Modal, Button } from "antd"; // Import Modal và Button từ Ant Design

const statusMap = {
    available: {
        label: "Còn trống",
        color: "#E6F7FF",
        icon: <FaCheckCircle color="#52c41a" />,
    },
    using: {
        label: "Đang dùng",
        color: "#FFF1F0",
        icon: <FaClock color="#faad14" />,
    },
    reserved: {
        label: "Đã đặt",
        color: "#FFFBE6",
        icon: <FaTimesCircle color="#f5222d" />,
    },
};

// Mảng giả lập các món ăn đã gọi
const fakeMenus = ["Gà rán", "Hamburger", "Pasta", "Pizza", "Bánh ngọt"];


const Billards = () => {
    const [tables, setTables] = useState([]);
    const [selected, setSelected] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái để mở/đóng modal
    const [currentTable, setCurrentTable] = useState(null); // Lưu thông tin bàn hiện tại


    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/billiard-tables"
                ); // Đổi URL tùy backend
                console.log(res.data)
                setTables(res.data.data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách bàn:", err);
            }
        };

        fetchTables();
    }, []);




    // Hàm mở modal khi bàn đang dùng
    const openModal = (table) => {
        setCurrentTable(table);
        setModalVisible(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setModalVisible(false);
        setCurrentTable(null);
    };

    return (
        <div className="table-booking-wrapper">
            <h2>Quản Lý Đặt Bàn</h2>

            <div className="table-grid">
                {tables.map((table) => {
                    const { label, color, icon } = statusMap[table.status];
                    const isSelected = selected === table.id;

                    return (
                        <div
                            key={table.id}
                            className={`table-card ${
                                isSelected ? "selected" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                if (table.status === "available") {
                                    setSelected(table.id);
                                } else if (table.status === "using") {
                                    openModal(table); // Mở modal khi bàn đang dùng
                                }
                            }}
                        >
                            <div className="table-icon">{icon}</div>
                            <div className="table-name">{table.name}</div>
                            <div className="table-status">{label}</div>

                            {table.status === "using" && table.usingTime && (
                                <div className="using-time">
                                    <p>
                                        <strong>Thời gian bắt đầu:</strong>{" "}
                                        {table.usingTime}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal hiển thị các món ăn đã gọi */}
            <Modal
                title={currentTable ? currentTable.name : "Bàn"}
                open={modalVisible} // Điều khiển hiển thị modal
                onCancel={closeModal} // Đóng modal khi nhấn "Cancel"
                footer={null} // Không cần nút footer
                width={500}
            >
                {currentTable && (
                    <>
                        <p>
                            <strong>Thời gian bắt đầu: </strong>
                            {currentTable.usingTime}
                        </p>
                        {currentTable.orderedItems.length > 0 ? (
                            <div className="ordered-items">
                                <p>
                                    <strong>Món đã gọi:</strong>
                                </p>
                                <ul>
                                    {currentTable.orderedItems.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <p>Chưa có món ăn nào được gọi.</p>
                        )}
                    </>
                )}
                <Button onClick={closeModal} type="primary">
                    Đóng
                </Button>
            </Modal>
        </div>
    );
};

export default Billards;
