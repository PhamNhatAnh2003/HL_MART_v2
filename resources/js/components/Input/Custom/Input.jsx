import React from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

const Input = ({
    value,
    setValue,
    type = "text",
    width = "fit-content",
    id = "id",
    label = "",
    small = false,
    medium = false,
    large = false,
    required = false,
}) => {
    const handleChangeValue = (e) => {
        setValue(e.target.value);
    };

    return (
        <div
            className={cx("custom-input", { small, medium, large })}
            style={{ width: width }}
        >
            <input
                id={`custom-input-${id}`}
                type={type}
                value={value}
                onChange={handleChangeValue}
                placeholder=" "
            />
            <label htmlFor={`custom-input-${id}`}>
                {label}
                {required && <span className={cx("required-note")}>*</span>}
            </label>
        </div>
    );
};

export default Input;
