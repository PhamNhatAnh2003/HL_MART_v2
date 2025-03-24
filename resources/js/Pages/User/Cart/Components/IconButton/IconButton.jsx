import { forwardRef, useState } from "react";
import classNames from "classnames/bind";
import PropTypes from "prop-types";

import styles from "./IconButton.module.scss";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const cx = classNames.bind(styles);

const IconButton = forwardRef(
    (
        {
            icon,
            children,
            content = "",
            type = "button",
            onClick,
            className,
            small,
            large,
            active,
            number,
            circle,
            border,
        },
        ref
    ) => {
        const classes = cx("medium", {
            [className]: className,
            small,
            large,
            circle,
            border,
            active,
        });

        return (
            <div>
                {content ? (
                    <Tippy delay={[0, 50]} content={content} placement="bottom">
                        <button
                            className={classes}
                            ref={ref}
                            type={type}
                            onClick={onClick}
                        >
                            {icon}
                            {number && (
                                <div className={cx("number")}>{number}</div>
                            )}
                            {children}
                        </button>
                    </Tippy>
                ) : (
                    <button
                        className={classes}
                        ref={ref}
                        type={type}
                        onClick={onClick}
                    >
                        {icon}
                        {number && <div className={cx("number")}>{number}</div>}
                        {children}
                    </button>
                )}
            </div>
        );
    }
);

IconButton.propTypes = {
    icon: PropTypes.node.isRequired,
    children: PropTypes.node,
    content: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    small: PropTypes.bool,
    large: PropTypes.bool,
    active: PropTypes.bool,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    circle: PropTypes.bool,
};

export default IconButton;
