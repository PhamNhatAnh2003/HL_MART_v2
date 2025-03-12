import classNames from "classnames/bind";

import styles from "./Checkbox.module.scss";

const cx = classNames.bind(styles);

const CheckboxInput = ({
    name,
    title = "title",
    id = "checkbox",
    checked,
    onChange,
    children,
    readOnly,
}) => {
    return (
        <div className={cx("checkbox-input", { checked: checked })}>
            <label htmlFor={id}>
                <input
                    type="checkbox"
                    name={name}
                    id={id}
                    checked={checked}
                    readOnly={readOnly}
                    onChange={readOnly ? () => {} : onChange}
                />
                <span className={cx("square")}></span>
                <span className={cx("title")}>
                    {children ? children : title}
                </span>
            </label>
        </div>
    );
};

export default CheckboxInput;
