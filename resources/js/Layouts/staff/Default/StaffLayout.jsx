import classNames from "classnames/bind";
import styles from "./StaffLayout.module.scss";
import HeaderStaff from "../components/Header/HeaderStaff";
import Footer from "~/components/Footer";

const cx = classNames.bind(styles);

const StaffLayout = ({ children }) => {
    return (
        <div className={cx("user-layout")}>
            <HeaderStaff />
            <div className={cx("content")}>{children}</div>
            <Footer />
        </div>
    );
};

export default StaffLayout;
