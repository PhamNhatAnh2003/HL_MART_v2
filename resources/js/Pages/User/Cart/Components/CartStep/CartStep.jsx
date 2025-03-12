import classNames from 'classnames/bind';

import styles from './CartStep.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCartShopping, faCheck, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const CartStep = ({ step = 4 }) => {
    return (
        <div className={cx('cart-step')}>
            <div className={cx('step-item', { active: step >= 1 })}>
                <div className={cx('step-icon')}>
                    <div className={cx('step-circle')}>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                </div>
                <span className={cx('title')}>Giỏ hàng</span>
            </div>

            <div className={cx('step-item', { active: step >= 2 })}>
                <div className={cx('step-icon')}>
                    <div className={cx('step-circle')}>
                        <FontAwesomeIcon icon={faBagShopping} />
                    </div>
                </div>
                <span className={cx('title')}>Đặt hàng</span>
            </div>

            <div className={cx('step-item', { active: step >= 3 })}>
                <div className={cx('step-icon')}>
                    <div className={cx('step-circle')}>
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                </div>
                <span className={cx('title')}>Thanh toán</span>
            </div>

            <div className={cx('step-item', { active: step >= 4 })}>
                <div className={cx('step-icon')}>
                    <div className={cx('step-circle')}>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                </div>
                <span className={cx('title')}>Hoàn thành</span>
            </div>
        </div>
    );
};

export default CartStep;
