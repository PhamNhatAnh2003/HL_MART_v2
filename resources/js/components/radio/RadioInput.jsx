import classNames from 'classnames/bind';

import styles from './Radio.module.scss';

const cx = classNames.bind(styles);

const RadioInput = ({ name, title = 'title', id = 'checkbox', checked, onChange, children }) => {
    return (
        <div className={cx('checkbox-input', { checked: checked })}>
            <label htmlFor={id}>
                <input type="radio" name={name} id={id} checked={checked} onChange={onChange} />
                <span className={cx('square')}></span>
                <span className={cx('title')}>{children ? children : title}</span>
            </label>
        </div>
    );
};

export default RadioInput;
