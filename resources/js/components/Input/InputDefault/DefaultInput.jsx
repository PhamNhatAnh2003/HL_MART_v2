import classNames from "classnames/bind";

import styles from "./DefaultInput.module.scss";

const cx = classNames.bind(styles);

const DefaultInput = ({
    value,
    setValue,
    label = "",
    placeholder = "",
    type = "text",
    id,
    width,
    required,
    className,
    inputClassName,
    readOnly,
    noLabel,
}) => {
    const handleChangeValue = (e) => {
        setValue(e.target.value);
    };
    return (
        <div
            className={cx("default-input", {
                "no-label": !label,
                [className]: className,
            })}
            style={{ width: width }}
        >
            <label
                htmlFor={`default-input-${id}`}
                style={{ display: noLabel ? "none" : "block" }}
            >
                {label}
                {required && <span className={cx("required-note")}>*</span>}
                {!label && "no-label"}
            </label>
            <input
                id={`default-input-${id}`}
                type={type}
                value={value}
                onChange={handleChangeValue}
                placeholder={placeholder}
                className={cx({ [inputClassName]: inputClassName })}
                readOnly={readOnly}
                autoComplete="off"
            />
        </div>
    );
};

export default DefaultInput;
