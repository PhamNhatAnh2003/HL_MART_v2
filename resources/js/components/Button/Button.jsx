import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

const Button = ({
    to,
    href,
    // css type, defult = text
    primary = false,
    secondary = false,
    extra = false,
    noBackground = false,
    text = false,
    danger = false,

    shadow = false,
    disabled = false,
    noClick = false,
    // border type, default = cheo canh
    curved = false,
    circle = false,
    noRadius = false,
    // size, defult = medium
    small = false,
    large = false,
    // icon
    leftIcon,
    rightIcon,
    // others
    width = "fit-content",
    contentCenter = false,
    active,
    children,
    className,
    onClick,
    ...passProps
}) => {
    let Comp = "button";
    const props = {
        onClick,
        ...passProps,
    };

    if (disabled) {
        delete props.onClick;
        Object.keys(props).forEach((key) => {
            if (key.startsWith("on") && typeof props[key] === "function") {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = "a";
    }

    const classes = cx("button", {
        [className]: className,
        primary,
        secondary,
        extra,
        danger,
        "no-background": noBackground,
        text,

        shadow,
        disabled,
        "no-click": noClick,
        curved,
        circle,
        small,
        large,
        active,
    });
    return (
        <Comp className={classes} {...props} style={{ width: width }}>
            {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
            <span className={cx("content", { center: contentCenter })}>
                {children}
            </span>
            {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
        </Comp>
    );
};

export default Button;
