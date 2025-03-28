import classNames from "classnames/bind";

import styles from "./UserLayout.module.scss";
import HeaderUser from "../components/Header/HeaderUser";
import Footer from "~/components/Footer";
import Category from "../../../components/Category/Category";

const cx = classNames.bind(styles);

const UserLayout = ({ children }) => {
    return (
        <div className={cx("user-layout")}>
            <HeaderUser />
            <Category />
            <div className={cx("content")}>{children}</div>
            <Footer />
        </div>
    );
};

export default UserLayout;
