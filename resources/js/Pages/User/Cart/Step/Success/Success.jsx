// src/pages/SuccessPage/SuccessPage.jsx
import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import Button from "~/components/Button";
import { useNavigate } from "react-router-dom";
import CartStep from "../../Components/CartStep/CartStep";
import styles from "./Success.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className={cx("container")}>
            <CartStep step={4} />
            <div className={cx("content")}>
                <CheckCircleOutlined className={cx("icon")} />
                <h1 className={cx("title")}>Đặt hàng thành công!</h1>
                <p className={cx("message")}>
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                </p>
                <Button primary onClick={() => navigate("/home")}>
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default Success;
