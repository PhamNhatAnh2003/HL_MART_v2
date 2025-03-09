import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const Button = ({
    type = "primary",
    size = "md",
    disabled,
    children,
    onClick,
}) => {
    return (
        <button
            className={classNames(styles.button, styles[type], styles[size], {
                [styles.disabled]: disabled,
            })}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
export default Button;
