
import React from "react";
import {
    FaPhone,
    FaEnvelope,
    FaClock,
    FaQuestionCircle,
    FaTruck,
    FaUndo,
    FaCreditCard,
    FaShieldAlt,
} from "react-icons/fa";
import styles from "./CustomerSupport.module.scss";
import classNames from "classnames/bind";
import ChatBox from "../../../components/Chatbox/Chatbox";
const cx = classNames.bind(styles);

const faqs = [
    {
        icon: <FaQuestionCircle className={cx("icon", "blue")} />,
        title: "Câu hỏi thường gặp",
        content: [
            "Làm sao để đặt hàng?",
            "Tôi có thể kiểm tra đơn hàng ở đâu?",
            "Tôi có thể hủy đơn không?",
            "Tôi có thể đổi địa chỉ giao hàng không?",
        ],
    },
    {
        icon: <FaTruck className={cx("icon", "green")} />,
        title: "Vận chuyển & Giao hàng",
        content: [
            "Phí ship là bao nhiêu?",
            "Thời gian giao hàng?",
            "Có hỗ trợ giao hàng 2H không?",
        ],
    },
    {
        icon: <FaCreditCard className={cx("icon", "purple")} />,
        title: "Thanh toán & Hoàn tiền",
        content: [
            "Phương thức thanh toán nào được chấp nhận?",
            "Hoàn tiền mất bao lâu?",
            "Có xuất hóa đơn không?",
        ],
    },
    {
        icon: <FaUndo className={cx("icon", "yellow")} />,
        title: "Đổi trả hàng",
        content: [
            "Đổi trả trong bao lâu?",
            "Trường hợp nào được đổi trả?",
            "Cách đổi hàng?",
        ],
    },
    {
        icon: <FaShieldAlt className={cx("icon", "red")} />,
        title: "Bảo hành sản phẩm",
        content: ["Sản phẩm nào được bảo hành?", "Thời gian và nơi bảo hành?"],
    },
];

const CustomerSupport = () => {
    return (
        <div className={cx("wrapper")}>
            <ChatBox />
            <h1 className={cx("heading")}>Chăm sóc khách hàng</h1>
            <p className={cx("subheading")}>
                Giải đáp thắc mắc và hỗ trợ bạn nhanh chóng nhất!
            </p>

            <div className={cx("faqList")}>
                {faqs.map((section, index) => (
                    <div key={index} className={cx("faqItem")}>
                        <div className={cx("faqHeader")}>
                            {section.icon}
                            <h2>{section.title}</h2>
                        </div>
                        <ul className={cx("faqContent")}>
                            {section.content.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={cx("contactBox")}>
                <h2>Liên hệ hỗ trợ</h2>
                <p>
                    <FaPhone className={cx("icon")} /> Hotline: 1900 xxxx (8h –
                    21h)
                </p>
                <p>
                    <FaEnvelope className={cx("icon")} /> Email:
                    support@hlmart.vn
                </p>
                <p>
                    <FaClock className={cx("icon")} /> Giờ làm việc: 8h – 21h
                    tất cả các ngày
                </p>
            </div>
        </div>
    );
};

export default CustomerSupport;
