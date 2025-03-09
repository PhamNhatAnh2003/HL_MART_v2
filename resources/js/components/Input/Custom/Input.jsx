import React from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

const Input = ({
    type = "text",
    placeholder = "Nhập nội dung...",
    value,
    onChange,
    iconLeft,
    iconRight,
    className,
    width = "100%",
    height = "50px",
}) => {
    return (
        <div className={cx("input-container", className)} style={{ width }}>
            {iconLeft && <span className={cx("icon-left")}>{iconLeft}</span>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={cx("input-field")}
                style={{ height }}
            />
            {iconRight && <span className={cx("icon-right")}>{iconRight}</span>}
        </div>
    );
};

export default Input;
