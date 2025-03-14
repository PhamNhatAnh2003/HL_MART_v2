import classNames from 'classnames/bind';

import styles from './AdminLayout.module.scss';
import HeaderAdmin from '../components/Header/HeaderAdmin';

const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    return (
        <div className={cx('admin-layout')}>
            <HeaderAdmin />
            {children}
            {/* <Footer /> */}
        </div>
    );
};

export default AdminLayout;
