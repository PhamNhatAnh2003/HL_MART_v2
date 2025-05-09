import React, {useContext ,useState, useEffect } from "react";
import axios from "axios";
import "./Billards.scss";
import { AuthContext } from "~/context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Modal, Button, DatePicker, TimePicker, message } from "antd";
import dayjs from "dayjs";

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

const Billards = () => {
    const { user: loginedProfile } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [selected, setSelected] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [bookingDate, setBookingDate] = useState(null);
    const [bookingTime, setBookingTime] = useState(null);

    const fetchTables = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/billiard-tables"
            );
            console.log(res.data)
            setTables(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách bàn:", err);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const openModal = (table) => {
        setCurrentTable(table);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentTable(null);
    };

    const openBookingModal = (table) => {
        setSelected(table.id);
        setCurrentTable(table);
        setBookingModalVisible(true);
    };

    const closeBookingModal = () => {
        setBookingModalVisible(false);
        setBookingDate(null);
        setBookingTime(null);
        setSelected(null);
        setCurrentTable(null);
    };

    const handleBooking = async () => {
        if (!bookingDate || !bookingTime) {
            message.error("Vui lòng chọn ngày và giờ đặt bàn.");
            return;
        }

        const bookingDateTime = dayjs(bookingDate)
            .hour(bookingTime.hour())
            .minute(bookingTime.minute())
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss");

        try {
            await axios.post("http://127.0.0.1:8000/api/book-table", {
                user_id: loginedProfile?.id,
                table_id: currentTable.id,
                booking_time: bookingDateTime,
            });

            message.success("Đặt bàn thành công!");
            closeBookingModal();
            fetchTables(); // cập nhật lại trạng thái
        } catch (err) {
            console.error("Lỗi đặt bàn:", err);
            message.error("Đặt bàn thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="table-booking-wrapper">
            <h2>Quản Lý Đặt Bàn</h2>

            <div className="table-grid">
                {tables.map((table) => {
                    const { label, color, icon } = statusMap[table.status];

                    return (
                        <div
                            key={table.id}
                            className={`table-card ${
                                selected === table.id ? "selected" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                if (table.status === "available") {
                                    openBookingModal(table);
                                } else if (table.status === "using") {
                                    openModal(table);
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

            {/* Modal hiển thị món đã gọi khi đang dùng */}
            <Modal
                title={currentTable ? currentTable.name : "Bàn"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={500}
            >
                {currentTable && (
                    <>
                        <p>
                            <strong>Thời gian bắt đầu: </strong>
                            {currentTable.usingTime}
                        </p>
                        {currentTable.orderedItems?.length > 0 ? (
                            <ul>
                                {currentTable.orderedItems.map(
                                    (item, index) => (
                                        <li key={index}>{item}</li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p>Chưa có món ăn nào được gọi.</p>
                        )}
                    </>
                )}
                <Button onClick={closeModal} type="primary">
                    Đóng
                </Button>
            </Modal>

            {/* Modal đặt bàn */}
            <Modal
                title={`Đặt bàn: ${currentTable?.name}`}
                open={bookingModalVisible}
                onCancel={closeBookingModal}
                onOk={handleBooking}
                okText="Xác nhận đặt"
                cancelText="Hủy"
            >
                <p>Chọn ngày và giờ đặt bàn:</p>
                <DatePicker
                    style={{ width: "100%", marginBottom: "1rem" }}
                    onChange={(value) => setBookingDate(value)}
                />
                <TimePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    onChange={(value) => setBookingTime(value)}
                />
            </Modal>
        </div>
    );
};

export default Billards;
