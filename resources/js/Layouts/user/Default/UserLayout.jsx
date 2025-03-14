import classNames from 'classnames/bind';

import styles from './UserLayout.module.scss';
import HeaderUser from '../components/Header/HeaderUser';

const cx = classNames.bind(styles);

const UserLayout = ({ children }) => {
    return (
        <div className={cx('user-layout')}>
            <HeaderUser />
            <div className={cx('content')}>{children}</div>
        </div>
    );
};

export default UserLayout;
