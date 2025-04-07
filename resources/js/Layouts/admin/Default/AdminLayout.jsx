import classNames from "classnames/bind";

import styles from "./AdminLayout.module.scss";
import HeaderAdmin from "../components/Header/HeaderAdmin";
import Footer from "~/components/Footer";

const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    return (
        <div className={cx("admin-layout")}>
            <HeaderAdmin />
            <div className={cx("content")}>{children}</div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
