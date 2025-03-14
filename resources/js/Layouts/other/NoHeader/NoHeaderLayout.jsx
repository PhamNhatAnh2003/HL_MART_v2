import classNames from 'classnames/bind';

import styles from './NoHeaderLayout.module.scss';

const cx = classNames.bind(styles);

const NoHeaderLayout = ({ children }) => {
    return <div className={cx('no-header-layout')}>{children}</div>;
};

export default NoHeaderLayout;
