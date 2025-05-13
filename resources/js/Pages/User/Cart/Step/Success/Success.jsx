// src/pages/SuccessPage/SuccessPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import Button from "~/components/Button";
import CartStep from "../../Components/CartStep/CartStep";
import styles from "./Success.module.scss";
import classNames from "classnames/bind";
import { formatPrice } from "~/utils/format";

const cx = classNames.bind(styles);

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Parse params nếu có từ thanh toán VNPAY
    const searchParams = new URLSearchParams(location.search);
    const transactionData = Object.fromEntries(searchParams.entries());

    const isVnPay = !!transactionData.vnp_TxnRef;
    const status =
        transactionData?.vnp_ResponseCode === "00" &&
        transactionData?.vnp_TransactionStatus === "00"
            ? "success"
            : "error";

    return (
        <div className={cx("container")}>
            <CartStep step={4} />
            <div className={cx("content")}>
                <CheckCircleOutlined className={cx("icon")} />
                <h1 className={cx("title")}>
                    {isVnPay && status === "success"
                        ? "Thanh toán VNPay thành công!"
                        : "Đặt hàng thành công!"}
                </h1>

                <p className={cx("message")}>
                    {isVnPay
                        ? status === "success"
                            ? "Cảm ơn bạn. Giao dịch VNPay đã được xử lý thành công."
                            : "Thanh toán VNPay thất bại hoặc bị hủy. Vui lòng thử lại."
                        : "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý."}
                </p>

                {isVnPay && (
                    <div className={cx("vnpay-info")}>
                        <p>
                            <strong>Mã giao dịch:</strong>{" "}
                            {transactionData.vnp_TxnRef}
                        </p>
                        <p>
                            <strong>Số tiền:</strong>{" "}
                            {Number(
                                transactionData.vnp_Amount / 100
                            ).toLocaleString("vi-VN")}{" "}
                            VND
                        </p>
                        <p>
                            <strong>Phương thức:</strong>{" "}
                            {transactionData.vnp_CardType}
                        </p>
                        <p>
                            <strong>Ngân hàng:</strong>{" "}
                            {transactionData.vnp_BankCode}
                        </p>
                        <p>
                            <strong>Ngày thanh toán:</strong>{" "}
                            {transactionData.vnp_PayDate}
                        </p>
                        <p>
                            <strong>Thông tin đơn hàng:</strong>{" "}
                            {transactionData.vnp_OrderInfo}
                        </p>
                        {status === "error" && (
                            <p>
                                <strong>Mã lỗi:</strong>{" "}
                                {transactionData.vnp_ResponseCode}
                            </p>
                        )}
                    </div>
                )}

                <Button primary onClick={() => navigate("/home")}>
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default Success;
